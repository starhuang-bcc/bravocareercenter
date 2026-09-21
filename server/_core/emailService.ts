import nodemailer from "nodemailer";

export type EmailPayload = {
  to: string;
  subject: string;
  content: string;
};

const SMTP_USER = process.env.SMTP_USER || "star.huang@bravocareercenter.com";
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;
const REPLY_TO = process.env.COMPANY_EMAIL || "career@bravocareercenter.com";

/**
 * Sends email through Gmail SMTP.
 *
 * Important: authenticate and send From the same mailbox by default.
 * Gmail/Google Workspace can reject or rewrite an unverified From alias.
 * Replies still go to the public BRAVO mailbox via replyTo.
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!payload.to || !payload.subject || !payload.content) {
    console.warn("[Email] Missing required email fields");
    return false;
  }

  const smtpPass = process.env.SMTP_PASS;
  const isTest = process.env.NODE_ENV === "test";

  if (isTest) {
    console.log(`[Email] Test environment detected, simulated sending email to ${payload.to}`);
    return true;
  }

  if (!smtpPass) {
    console.error("[Email] SMTP_PASS is not configured");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: smtpPass,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 30000,
    });

    const info = await transporter.sendMail({
      from: `"Bravo Career Center" <${SMTP_FROM}>`,
      replyTo: REPLY_TO,
      to: payload.to,
      subject: payload.subject,
      text: payload.content,
      html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">${payload.content.replace(/\n/g, "<br>")}</div>`,
    });

    console.log("[Email] SMTP send succeeded", {
      to: payload.to,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });
    return true;
  } catch (error: any) {
    console.error("[Email] SMTP send failed", {
      to: payload.to,
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
      response: error?.response,
      message: error?.message,
    });
    return false;
  }
}
