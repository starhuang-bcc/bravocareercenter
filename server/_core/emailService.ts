export type EmailPayload = {
  to: string;
  subject: string;
  content: string;
};

const GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";
const GMAIL_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GMAIL_SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

function encodeHeader(value: string) {
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function base64Url(value: string) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function getAccessToken() {
  const clientId = process.env.GMAIL_CLIENT_ID?.trim();
  const clientSecret = process.env.GMAIL_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET and GMAIL_REFRESH_TOKEN are required");
  }

  const response = await fetch(GMAIL_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json() as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !data.access_token) {
    console.error("[Email] Gmail OAuth token endpoint rejected request", {
      status: response.status,
      statusText: response.statusText,
      error: data.error || "unknown_error",
      errorDescription: data.error_description || "not_provided",
    });
    throw new Error(
      `Gmail OAuth token exchange failed (${response.status}): ${data.error || "unknown_error"} - ${data.error_description || response.statusText || "unknown error"}`,
    );
  }

  console.log("[Email] Gmail OAuth token exchange succeeded", {
    status: response.status,
    scope: GMAIL_SEND_SCOPE,
  });

  return data.access_token;
}

/**
 * Send email with Gmail API over HTTPS (443).
 * This avoids outbound SMTP ports, which are unavailable on Render Free.
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!payload.to || !payload.subject || !payload.content) {
    console.warn("[Email] Missing required email fields");
    return false;
  }

  if (process.env.NODE_ENV === "test") {
    console.log(`[Email] Test environment detected, simulated Gmail API send to ${payload.to}`);
    return true;
  }

  const sender = (process.env.GMAIL_SENDER || "star.huang@bravocareercenter.com").trim();
  const replyTo = (process.env.COMPANY_EMAIL || "career@bravocareercenter.com").trim();

  try {
    const accessToken = await getAccessToken();
    const boundary = `bravo_${Date.now().toString(36)}`;
    const html = `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">${escapeHtml(payload.content).replace(/\n/g, "<br>")}</div>`;

    const mime = [
      `From: Bravo Career Center <${sender}>`,
      `Reply-To: ${replyTo}`,
      `To: ${payload.to}`,
      `Subject: ${encodeHeader(payload.subject)}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(payload.content, "utf8").toString("base64"),
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(html, "utf8").toString("base64"),
      `--${boundary}--`,
      "",
    ].join("\r\n");

    const response = await fetch(GMAIL_SEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: base64Url(mime) }),
    });

    const data = await response.json() as {
      id?: string;
      threadId?: string;
      error?: { message?: string; status?: string };
    };

    if (!response.ok || !data.id) {
      throw new Error(
        `Gmail API send failed (${response.status}): ${data.error?.message || data.error?.status || "unknown error"}`,
      );
    }

    console.log("[Email] Gmail API send succeeded", {
      to: payload.to,
      messageId: data.id,
      threadId: data.threadId,
    });
    return true;
  } catch (error: any) {
    console.error("[Email] Gmail API send failed", {
      to: payload.to,
      message: error?.message,
      scope: GMAIL_SEND_SCOPE,
    });
    return false;
  }
}
