import { describe, expect, it } from "vitest";
import {
  consultationBookingLink,
  consultationDetails,
  consultationOptions,
  getConsultationDetails,
  isConsultationOptionId,
} from "@shared/consultation";

describe("consultation content", () => {
  it("exposes both consultation options", () => {
    expect(consultationOptions.map((option) => option.id)).toEqual(["career", "bravo"]);
    expect(consultationOptions.map((option) => option.title)).toEqual(["職涯諮詢", "築夢諮詢"]);
  });

  it("returns the selected service details", () => {
    expect(getConsultationDetails("career").title).toBe("職涯諮詢");
    expect(getConsultationDetails("bravo").title).toBe("築夢諮詢");
    expect(consultationDetails.career.paragraphs.length).toBeGreaterThan(0);
  });

  it("validates option ids and keeps the booking link external", () => {
    expect(isConsultationOptionId("career")).toBe(true);
    expect(isConsultationOptionId("bravo")).toBe(true);
    expect(isConsultationOptionId("unknown")).toBe(false);
    expect(consultationBookingLink).toMatch(/^https:\/\//);
  });

  it("uses the permanent transparent logo asset and exposes booking details", async () => {
    const { consultationInfo, consultationLogoUrl } = await import("@shared/consultation");

    expect(consultationLogoUrl).toMatch(/^\/manus-storage\/.+\.(webp|png)$/);
    expect(consultationInfo.map((item) => item.label)).toEqual([
      "諮詢時間",
      "諮詢費用",
      "付款方式",
      "諮詢地點",
    ]);
  });
});
