const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@diagrams.love';
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Avito Georgia';

async function sendBrevoEmail(to: string, subject: string, htmlContent: string, textContent: string): Promise<void> {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { email: BREVO_SENDER_EMAIL, name: BREVO_SENDER_NAME },
      to: [{ email: to }],
      subject,
      htmlContent,
      textContent,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo API error ${res.status}: ${body}`);
  }
}

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
  await sendBrevoEmail(
    to,
    `Price drop: ${title} — Avito Georgia`,
    `<p>The listing <strong>${title}</strong> you favorited dropped in price from <s>${oldPrice}</s> to <strong>${newPrice}</strong>.</p>`,
    `The listing "${title}" you favorited dropped in price from ${oldPrice} to ${newPrice}.`
  );
}

export async function sendListingRemovedNotification(
  to: string,
  title: string
): Promise<void> {
  if (process.env.DEV_AUTH === 'true') {
    console.log(`[DEV] Listing removed notification to ${to}: ${title}`);
    return;
  }
  await sendBrevoEmail(
    to,
    `Listing removed: ${title} — Avito Georgia`,
    `<p>The listing <strong>${title}</strong> you favorited has been removed by the seller.</p>`,
    `The listing "${title}" you favorited has been removed by the seller.`
  );
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
  await sendBrevoEmail(email, tpl.subject, tpl.html, tpl.text);
}

export async function sendListingApprovedEmail(
  to: string,
  title: string
): Promise<void> {
  if (process.env.DEV_AUTH === 'true') {
    console.log(`[DEV] Listing approved email to ${to}: "${title}"`);
    return;
  }
  if (!BREVO_API_KEY) {
    console.log(`[MAIL] BREVO_API_KEY not set — skipping approval email to ${to}`);
    return;
  }
  await sendBrevoEmail(
    to,
    `Ваше объявление опубликовано — Avito Georgia`,
    `<p>Ваше объявление <strong>${title}</strong> прошло модерацию и теперь опубликовано.</p>`,
    `Ваше объявление "${title}" прошло модерацию и теперь опубликовано.`
  );
}

export async function sendListingRejectedEmail(
  to: string,
  title: string,
  reason?: string | null
): Promise<void> {
  if (process.env.DEV_AUTH === 'true') {
    console.log(`[DEV] Listing rejected email to ${to}: "${title}", reason: ${reason}`);
    return;
  }
  if (!BREVO_API_KEY) {
    console.log(`[MAIL] BREVO_API_KEY not set — skipping rejection email to ${to}`);
    return;
  }
  const reasonBlock = reason
    ? `<p>Причина: ${reason}</p>`
    : '';
  const reasonText = reason ? `\nПричина: ${reason}` : '';
  await sendBrevoEmail(
    to,
    `Ваше объявление отклонено — Avito Georgia`,
    `<p>Ваше объявление <strong>${title}</strong> было отклонено модератором.</p>${reasonBlock}`,
    `Ваше объявление "${title}" было отклонено модератором.${reasonText}`
  );
}
