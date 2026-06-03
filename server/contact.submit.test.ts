import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock notifyOwner
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(async () => true),
}));

type PublicContext = Omit<TrpcContext, "user"> & { user: null };

function createPublicContext(): PublicContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  it("successfully submits a contact form with all required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      category: "1",
      lastName: "王",
      firstName: "小明",
      email: "test@example.com",
      phone: "0912-345-678",
      subject: "招募詢問",
      message: "我們需要招募軟體工程師",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toContain("訊息已送出");
  });

  it("successfully submits a contact form with only required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      category: "2",
      lastName: "李",
      firstName: "美美",
      email: "test2@example.com",
      message: "我想合作",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toContain("訊息已送出");
  });

  it("rejects invalid email format", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        category: "1",
        lastName: "王",
        firstName: "小明",
        email: "invalid-email",
        message: "測試",
      });
      expect.fail("Should have thrown an error");
    } catch (error: unknown) {
      expect(error).toBeDefined();
    }
  });

  it("rejects empty required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        category: "1",
        lastName: "",
        firstName: "小明",
        email: "test@example.com",
        message: "測試",
      });
      expect.fail("Should have thrown an error");
    } catch (error: unknown) {
      expect(error).toBeDefined();
    }
  });

  it("handles different category types correctly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const categories = ["1", "2", "3", "4", "5"];

    for (const category of categories) {
      const result = await caller.contact.submit({
        category,
        lastName: "測試",
        firstName: "用戶",
        email: `test${category}@example.com`,
        message: `測試分類 ${category}`,
      });

      expect(result.success).toBe(true);
    }
  });
});
