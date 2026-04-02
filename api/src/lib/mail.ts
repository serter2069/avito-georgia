import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const templates = {
  ru: (otp: string) => ({
    subject: 'Ваш код входа — Avito Georgia',
    text: `Ваш код: ${otp}\nДействителен 10 минут.`,
    html: `<p>Ваш код входа: <strong>${otp}</strong></p><p>Действителен 10 минут.</p>`,
  }),
  en: (otp: string) => ({
    subject: 'Your login code — Avito Georgia',
    text: `Your code: ${otp}\nValid for 10 minutes.`,
    html: `<p>Your login code: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`,
  }),
  ka: (otp: string) => ({
    subject: 'თქვენი შესვლის კოდი — Avito Georgia',
    text: `თქვენი კოდი: ${otp}\nმოქმედია 10 წუთი.`,
    html: `<p>შესვლის კოდი: <strong>${otp}</strong></p><p>მოქმედია 10 წუთი.</p>`,
  }),
};

export async function sendOtpEmail(
  email: string,
  otp: string,
  locale: string = 'ru'
): Promise<void> {
  if (process.env.DEV_AUTH === 'true') {
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    return;
  }
  const lang = (['ru', 'en', 'ka'].includes(locale) ? locale : 'ru') as 'ru' | 'en' | 'ka';
  const tpl = templates[lang](otp);
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: tpl.subject,
    text: tpl.text,
    html: tpl.html,
  });
}
