import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const { createConsultationRequest, notifyOwner, sendEmail } = vi.hoisted(() => ({
  createConsultationRequest: vi.fn(async (request: Record<string, unknown>) => ({
    id: 42,
    ...request,
    createdAt: new Date(),
  })),
  notifyOwner: vi.fn(async () => true),
  sendEmail: vi.fn(async () => true),
}));

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return { ...actual, createConsultationRequest };
});

vi.mock("./_core/notification", () => ({ notifyOwner }));
vi.mock("./_core/emailService", () => ({ sendEmail }));

type PublicContext = Omit<TrpcContext, "user"> & { user: null };

function createPublicContext(): PublicContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("consultations.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves a booking request and notifies the owner", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.consultations.submit({
      name: "王小明",
      email: "test@example.com",
      phone: "0912345678",
      serviceType: "career",
      consultationMode: "online",
      preferredTimes: ["平日晚上 18:00–21:00"],
      message: "想討論轉職方向",
    });

    expect(result).toEqual({ success: true, requestId: 42, notified: true });
    expect(createConsultationRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "王小明",
        serviceType: "career",
        consultationMode: "online",
        preferredTime: "平日晚上 18:00–21:00",
        status: "new",
      }),
    );
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "career@bravocareercenter.com",
        subject: expect.stringContaining("預約申請"),
      }),
    );
    expect(notifyOwner).toHaveBeenCalledOnce();
  });

  it("rejects a request without a preferred time", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.consultations.submit({
        name: "王小明",
        email: "test@example.com",
        phone: "0912345678",
        serviceType: "dream",
        consultationMode: "in_person",
        preferredTimes: [],
      }),
    ).rejects.toThrow("請至少選擇一個偏好諮詢時段");

    expect(createConsultationRequest).not.toHaveBeenCalled();
  });
});
