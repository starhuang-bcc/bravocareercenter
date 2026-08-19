import { describe, expect, it } from "vitest";
import nodemailer from "nodemailer";

describe("Google SMTP configuration", () => {
  it.runIf(Boolean(process.env.SMTP_PASS))("verifies Gmail SMTP credentials without sending an email", async () => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "star.huang@bravocareercenter.com",
        pass: process.env.SMTP_PASS,
      },
    });

    await expect(transporter.verify()).resolves.toBe(true);
  });

  it.skipIf(Boolean(process.env.SMTP_PASS))("requires SMTP_PASS to run credential verification", () => {
    expect(process.env.SMTP_PASS).toBeTruthy();
  });
});
