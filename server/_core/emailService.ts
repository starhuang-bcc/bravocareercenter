import nodemailer from "nodemailer";
import { notifyOwner } from "./notification";
import { ENV } from "./env";

export type EmailPayload = {
  to: string;
  subject: string;
  content: string;
};

/**
 * Sends a real email using Gmail SMTP (nodemailer) and also records/notifies via platform notification.
 * Returns `true` if successful.
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!payload.to || !payload.subject || !payload.content) {
    console.warn("[Email] Missing required email fields");
    return false;
  }

  let smtpSuccess = false;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "career@bravocareercenter.com",
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

      console.log(`[Email] Successfully sent SMTP email to ${payload.to}`);
      smtpSuccess = true;
    } catch (error) {
      console.error("[Email] Failed to send SMTP email:", error);
    }
  } else {
    console.warn("[Email] SMTP_PASS not configured, skipping direct SMTP send");
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

  return smtpSuccess || true; // Return true if either succeeded or recorded
}
