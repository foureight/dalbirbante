import nodemailer from "nodemailer";

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.CONTACT_TO,
  );
}

export async function sendContactEmail(payload: ContactPayload) {
  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;
  const to = process.env.CONTACT_TO!;
  const from = process.env.CONTACT_FROM || user;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const subject = `Zpráva z webu Dal Birbante – ${payload.name}`;
  const text = [
    `Jméno: ${payload.name}`,
    `E-mail: ${payload.email}`,
    "",
    payload.message,
  ].join("\n");

  await transporter.sendMail({
    from: `"Dal Birbante web" <${from}>`,
    to,
    replyTo: payload.email,
    subject,
    text,
  });
}
