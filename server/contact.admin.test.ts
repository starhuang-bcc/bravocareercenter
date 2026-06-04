import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

// Mock database functions
vi.mock("./db", () => ({
  createContactSubmission: vi.fn(async (submission) => ({
    id: 1,
    ...submission,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  getContactSubmissions: vi.fn(async () => [
    {
      id: 1,
      category: "1",
      lastName: "王",
      firstName: "小明",
      email: "test@example.com",
      phone: "0912-345-678",
      subject: "招募詢問",
      message: "我們需要招募軟體工程師",
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getContactSubmissionById: vi.fn(async (id) => ({
    id,
    category: "1",
    lastName: "王",
    firstName: "小明",
    email: "test@example.com",
    phone: "0912-345-678",
    subject: "招募詢問",
    message: "我們需要招募軟體工程師",
    status: "new",
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  updateContactSubmissionStatus: vi.fn(async () => true),
  getContactSubmissionStats: vi.fn(async () => ({
    total: 5,
    new: 2,
    read: 1,
    replied: 1,
    archived: 1,
  })),
}));

// Mock notifyOwner and sendEmail
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(async () => true),
}));

vi.mock("./_core/emailService", () => ({
  sendEmail: vi.fn(async () => true),
}));

type AdminContext = Omit<TrpcContext, "user"> & { user: { role: "admin"; id: string; openId: string } | null };

function createAdminContext(isAdmin: boolean = true): AdminContext {
  return {
    user: isAdmin
      ? {
          role: "admin",
          id: "1",
          openId: "admin-user",
        }
      : null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("contact admin routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("contact.list", () => {
    it("returns submissions for admin users", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        limit: 20,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("throws error for non-admin users", async () => {
      const ctx = createAdminContext(false);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contact.list({
          limit: 20,
          offset: 0,
        });
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect(error).toBeDefined();
      }
    });

    it("filters submissions by status", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        status: "new",
        limit: 20,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("contact.getById", () => {
    it("returns submission details for admin users", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.getById({ id: 1 });

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.email).toBe("test@example.com");
    });

    it("throws error for non-admin users", async () => {
      const ctx = createAdminContext(false);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contact.getById({ id: 1 });
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("contact.updateStatus", () => {
    it("updates submission status for admin users", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.updateStatus({
        id: 1,
        status: "read",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it("throws error for non-admin users", async () => {
      const ctx = createAdminContext(false);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contact.updateStatus({
          id: 1,
          status: "read",
        });
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("contact.getStats", () => {
    it("returns statistics for admin users", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.getStats();

      expect(result).toBeDefined();
      expect(result.total).toBe(5);
      expect(result.new).toBe(2);
      expect(result.read).toBe(1);
      expect(result.replied).toBe(1);
      expect(result.archived).toBe(1);
    });

    it("throws error for non-admin users", async () => {
      const ctx = createAdminContext(false);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contact.getStats();
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect(error).toBeDefined();
      }
    });
  });
});
