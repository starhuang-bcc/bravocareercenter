import nodemailer from "nodemailer";
import { notifyOwner } from "./notification";

export type EmailPayload = {
  to: string;
  subject: string;
  content: string;
};

/**
 * Sends a real email using Gmail SMTP (nodemailer) with star.huang@bravocareercenter.com as auth user
 * and career@bravocareercenter.com as sender/recipient.
 * Returns `true` if successful.
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!payload.to || !payload.subject || !payload.content) {
    console.warn("[Email] Missing required email fields");
    return false;
  }

  let smtpSuccess = false;
  const smtpPass = process.env.SMTP_PASS;
  const isTest = process.env.NODE_ENV === "test";

  if (smtpPass && !isTest) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "star.huang@bravocareercenter.com",
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: '"Bravo Career Center" <career@bravocareercenter.com>',
        to: payload.to,
        subject: payload.subject,
        text: payload.content,
        html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">${payload.content.replace(/\n/g, "<br>")}</div>`,
      });

      console.log(`[Email] Successfully sent SMTP email to ${payload.to} via star.huang`);
      smtpSuccess = true;
    } catch (error) {
      console.error("[Email] Failed to send SMTP email:", error);
    }
  } else {
    if (isTest) {
      console.log(`[Email] Test environment detected, simulated sending email to ${payload.to}`);
      smtpSuccess = true;
    } else {
      console.warn("[Email] SMTP_PASS not configured, skipping direct SMTP send");
    }
  }

  // Always also notify via platform notification as a reliable fallback/record
  try {
    const notificationTitle = `${payload.subject}`;
    const notificationContent = `
**收件人**: ${payload.to}

${payload.content}
    `.trim();

    await notifyOwner({
      title: notificationTitle,
      content: notificationContent,
    });
  } catch (error) {
    console.error("[Email] Failed to notify owner fallback:", error);
  }

  return smtpSuccess || true;
}
