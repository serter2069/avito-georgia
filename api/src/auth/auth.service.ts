import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import prisma from '../lib/prisma';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
const ACCESS_TTL = '15m';
const REFRESH_TTL = '30d';

const DEV_AUTH = process.env.DEV_AUTH === 'true';

// i18n OTP email templates
const emailTemplates: Record<string, (code: string) => { subject: string; text: string }> = {
  ru: (code) => ({
    subject: 'Ваш код подтверждения',
    text: `Ваш код для входа: ${code}\n\nКод действителен 10 минут.`,
  }),
  en: (code) => ({
    subject: 'Your verification code',
    text: `Your login code: ${code}\n\nValid for 10 minutes.`,
  }),
  ka: (code) => ({
    subject: 'თქვენი დადასტურების კოდი',
    text: `თქვენი შესვლის კოდი: ${code}\n\nმოქმედებს 10 წუთი.`,
  }),
};

function getLocale(acceptLanguage?: string): string {
  if (!acceptLanguage) return 'ru';
  const lang = acceptLanguage.toLowerCase().split(',')[0].trim().substring(0, 2);
  return ['ru', 'en', 'ka'].includes(lang) ? lang : 'ru';
}

function generateOtpCode(): string {
  return DEV_AUTH ? '000000' : String(Math.floor(100000 + Math.random() * 900000));
}

function generateTokens(userId: string, email: string, role: string) {
  const payload = { userId, email, role };
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
  return { accessToken, refreshToken };
}

async function sendOtpEmail(email: string, code: string, locale: string): Promise<void> {
  // In dev mode with no SMTP configured — just log
  if (DEV_AUTH) {
    console.log(`[auth] DEV OTP for ${email}: ${code}`);
    return;
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const template = (emailTemplates[locale] || emailTemplates['ru'])(code);
  await transport.sendMail({
    from: process.env.SMTP_FROM || 'noreply@avito-georgia.com',
    to: email,
    subject: template.subject,
    text: template.text,
  });
}

export async function requestOtp(email: string, acceptLanguage?: string): Promise<void> {
  const locale = getLocale(acceptLanguage);

  // Rate limit: block if an unused OTP was created within the last 60 seconds
  const recentOtp = await prisma.otpCode.findFirst({
    where: {
      email,
      used: false,
      createdAt: { gte: new Date(Date.now() - 60_000) },
    },
  });
  if (recentOtp) {
    const err = new Error('Rate limit: wait 60 seconds before requesting a new OTP') as Error & { statusCode: number };
    err.statusCode = 429;
    throw err;
  }

  // Upsert user first (FK constraint: OtpCode.userId references User.id)
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, locale },
  });

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60_000); // 10 minutes

  await prisma.otpCode.create({
    data: {
      email,
      code,
      expiresAt,
      userId: user.id,
    },
  });

  await sendOtpEmail(email, code, locale);
}

export async function verifyOtp(
  email: string,
  code: string
): Promise<{ accessToken: string; refreshToken: string; user: { id: string; email: string; role: string } }> {
  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      email,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (!otpRecord) {
    const err = new Error('Invalid or expired OTP') as Error & { statusCode: number };
    err.statusCode = 400;
    throw err;
  }

  // Mark OTP as used
  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { used: true },
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const tokens = generateTokens(user.id, user.email, user.role);
  return { ...tokens, user: { id: user.id, email: user.email, role: user.role } };
}

export async function refreshTokens(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  let payload: { userId: string; email: string; role: string };
  try {
    payload = jwt.verify(refreshToken, REFRESH_SECRET) as typeof payload;
  } catch {
    const err = new Error('Invalid or expired refresh token') as Error & { statusCode: number };
    err.statusCode = 401;
    throw err;
  }

  // Verify user still exists
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    const err = new Error('User not found') as Error & { statusCode: number };
    err.statusCode = 401;
    throw err;
  }

  return generateTokens(user.id, user.email, user.role);
}
