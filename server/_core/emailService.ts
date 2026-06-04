import { notifyOwner } from "./notification";

export type EmailPayload = {
  to: string;
  subject: string;
  content: string;
};

/**
 * Sends an email using the Manus notification service.
 * For company emails, uses the notification system.
 * For user emails (auto-reply), formats as a notification.
 * Returns `true` if successful, `false` if the service is unavailable.
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!payload.to || !payload.subject || !payload.content) {
    console.warn("[Email] Missing required email fields");
    return false;
  }

  try {
    // Format the email as a notification
    const notificationTitle = `${payload.subject}`;
    const notificationContent = `
**收件人**: ${payload.to}

${payload.content}
    `.trim();

    // Send via notification service
    const success = await notifyOwner({
      title: notificationTitle,
      content: notificationContent,
    });

    if (success) {
      console.log(`[Email] Successfully sent email to ${payload.to}`);
    } else {
      console.warn(`[Email] Failed to send email to ${payload.to}`);
    }

    return success;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}
