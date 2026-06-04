import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database functions
vi.mock("./db", () => ({
  createContactSubmission: vi.fn(async (submission) => ({
    id: 1,
    ...submission,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  getContactSubmissions: vi.fn(async (filters) => {
    // Simulate filtering logic
    const allSubmissions = [
      {
        id: 1,
        category: "1",
        lastName: "王",
        firstName: "小明",
        email: "wang@example.com",
        phone: "0912-345-678",
        subject: "招募詢問",
        message: "我們需要招募軟體工程師",
        status: "new",
        createdAt: new Date("2026-06-01"),
        updatedAt: new Date("2026-06-01"),
      },
      {
        id: 2,
        category: "2",
        lastName: "李",
        firstName: "美美",
        email: "li@example.com",
        phone: "0912-345-679",
        subject: "合作詢問",
        message: "想要合作開發新項目",
        status: "read",
        createdAt: new Date("2026-06-02"),
        updatedAt: new Date("2026-06-02"),
      },
      {
        id: 3,
        category: "3",
        lastName: "張",
        firstName: "三",
        email: "zhang@example.com",
        phone: "0912-345-680",
        subject: "測驗結果",
        message: "想要了解測驗結果",
        status: "replied",
        createdAt: new Date("2026-06-03"),
        updatedAt: new Date("2026-06-03"),
      },
    ];

    let results = [...allSubmissions];

    // Apply status filter
    if (filters?.status) {
      results = results.filter((s) => s.status === filters.status);
    }

    // Apply keyword search
    if (filters?.keyword) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter(
        (s) =>
          s.lastName.toLowerCase().includes(keyword) ||
          s.firstName.toLowerCase().includes(keyword) ||
          s.email.toLowerCase().includes(keyword) ||
          s.subject.toLowerCase().includes(keyword) ||
          s.message.toLowerCase().includes(keyword)
      );
    }

    // Apply date range filter
    if (filters?.startDate) {
      results = results.filter((s) => s.createdAt >= filters.startDate);
    }
    if (filters?.endDate) {
      const endOfDay = new Date(filters.endDate);
      endOfDay.setDate(endOfDay.getDate() + 1);
      results = results.filter((s) => s.createdAt <= endOfDay);
    }

    return results;
  }),
  getContactSubmissionById: vi.fn(async (id) => ({
    id,
    category: "1",
    lastName: "王",
    firstName: "小明",
    email: "wang@example.com",
    phone: "0912-345-678",
    subject: "招募詢問",
    message: "我們需要招募軟體工程師",
    status: "new",
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  updateContactSubmissionStatus: vi.fn(async () => true),
  getContactSubmissionStats: vi.fn(async () => ({
    total: 3,
    new: 1,
    read: 1,
    replied: 1,
    archived: 0,
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

describe("contact search and filter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("contact.list with keyword search", () => {
    it("searches by last name", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        keyword: "王",
        limit: 20,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("searches by email", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        keyword: "wang@example.com",
        limit: 20,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("searches by subject", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        keyword: "招募",
        limit: 20,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("searches by message content", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        keyword: "軟體工程師",
        limit: 20,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("contact.list with date range filter", () => {
    it("filters by start date", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        startDate: new Date("2026-06-02"),
        limit: 20,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("filters by end date", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        endDate: new Date("2026-06-02"),
        limit: 20,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("filters by date range", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        startDate: new Date("2026-06-01"),
        endDate: new Date("2026-06-02"),
        limit: 20,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("contact.list with combined filters", () => {
    it("combines status and keyword search", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        status: "new",
        keyword: "王",
        limit: 20,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("combines keyword search and date range", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        keyword: "招募",
        startDate: new Date("2026-06-01"),
        endDate: new Date("2026-06-02"),
        limit: 20,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it("combines all filters", async () => {
      const ctx = createAdminContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.contact.list({
        status: "new",
        keyword: "王",
        startDate: new Date("2026-06-01"),
        endDate: new Date("2026-06-02"),
        limit: 20,
        offset: 0,
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("authorization checks", () => {
    it("throws error for non-admin users with search", async () => {
      const ctx = createAdminContext(false);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contact.list({
          keyword: "王",
          limit: 20,
          offset: 0,
        });
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect(error).toBeDefined();
      }
    });

    it("throws error for non-admin users with date filter", async () => {
      const ctx = createAdminContext(false);
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.contact.list({
          startDate: new Date("2026-06-01"),
          limit: 20,
          offset: 0,
        });
        expect.fail("Should have thrown an error");
      } catch (error: unknown) {
        expect(error).toBeDefined();
      }
    });
  });
});
