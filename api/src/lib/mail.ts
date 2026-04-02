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

export async function sendPriceDropNotification(
  to: string,
  title: string,
  oldPrice: number,
  newPrice: number
): Promise<void> {
  if (process.env.DEV_AUTH === 'true') {
    console.log(`[DEV] Price drop notification to ${to}: ${title} ${oldPrice} -> ${newPrice}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Price drop: ${title} — Avito Georgia`,
    text: `The listing "${title}" you favorited dropped in price from ${oldPrice} to ${newPrice}.`,
    html: `<p>The listing <strong>${title}</strong> you favorited dropped in price from <s>${oldPrice}</s> to <strong>${newPrice}</strong>.</p>`,
  });
}

export async function sendListingRemovedNotification(
  to: string,
  title: string
): Promise<void> {
  if (process.env.DEV_AUTH === 'true') {
    console.log(`[DEV] Listing removed notification to ${to}: ${title}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Listing removed: ${title} — Avito Georgia`,
    text: `The listing "${title}" you favorited has been removed by the seller.`,
    html: `<p>The listing <strong>${title}</strong> you favorited has been removed by the seller.</p>`,
  });
}

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
