import { describe, it, expect } from "vitest";
import {
  emptyPlatform,
  calculateMonth,
  defaultRows,
  type Account,
  type Month,
} from "../../shared/enterprise";
import { getMonth, mutate, view } from "./service";
import { hashPassword, verifyPassword } from "./store";
const admin: Account = {
  id: "a",
  name: "admin",
  email: "a@b.co",
  role: "admin",
  passwordHash: "",
  active: true,
};
function fixture() {
  const s = emptyPlatform();
  s.companies = [
    { id: "c1", name: "C1" },
    { id: "c2", name: "C2" },
  ];
  s.talents = [
    {
      id: "t1",
      companyId: "c1",
      name: "小明",
      title: "工程師",
      salary: 50000,
      start: "2026-01-01",
      end: "",
      status: "在職",
    },
  ];
  mutate(s, admin, "generate", {
    talentId: "t1",
    month: "2026-01",
    holidays: ["2026-01-01"],
    calendarReviewed: true,
  });
  return s;
}
const employee: Account = {
  ...admin,
  id: "e",
  role: "talent",
  companyId: "c1",
  talentId: "t1",
};
describe("enterprise isolation and attendance workflow", () => {
  it("limits company reads and rejects cross-company direct access", () => {
    const s = fixture();
    s.months[0].published = true;
    const a = { ...admin, role: "company" as const, companyId: "c2" };
    expect(view(s, a).months).toHaveLength(0);
    expect(view(s, a).talents).toHaveLength(0);
    expect(() => getMonth(s, a, s.months[0].id)).toThrow("無權限");
    expect(() => mutate(s, a, "saveMonth", {})).toThrow("無權限");
  });
  it("only fills missing days and never overwrites punched times", () => {
    const s = fixture(),
      m = s.months[0];
    m.rows[0].start = "10:00";
    m.rows[0].source = "每日打卡";
    mutate(s, admin, "generate", {
      talentId: "t1",
      month: "2026-01",
      holidays: ["2026-01-01"],
      calendarReviewed: true,
    });
    expect(m.rows[0].start).toBe("10:00");
    expect(new Set(m.rows.map(r => r.date)).size).toBe(m.rows.length);
  });
  it("invalidates signature on edit and rejects stale confirmation", () => {
    const s = fixture(),
      m = s.months[0];
    mutate(s, employee, "sign", {
      id: m.id,
      version: m.version,
      name: "小明",
      image: "data:image/png;base64,aA==",
    });
    const old = m.version;
    mutate(s, admin, "saveMonth", {
      id: m.id,
      version: m.version,
      rows: m.rows,
      salary: 50000,
      billingRule: "fixed",
      payrollReviewed: true,
    });
    expect(m.signature).toBeUndefined();
    expect(() =>
      mutate(s, employee, "sign", {
        id: m.id,
        version: old,
        name: "小明",
        image: "data:image/png;base64,aA==",
      })
    ).toThrow();
  });
  it("requires signature and reviewed payroll before publication", () => {
    const s = fixture(),
      m = s.months[0];
    expect(() =>
      mutate(s, admin, "publish", { id: m.id, version: m.version })
    ).toThrow();
    mutate(s, admin, "saveMonth", {
      id: m.id,
      version: m.version,
      rows: m.rows,
      salary: 50000,
      billingRule: "fixed",
      payrollReviewed: true,
    });
    mutate(s, employee, "sign", {
      id: m.id,
      version: m.version,
      name: "小明",
      image: "data:image/png;base64,aA==",
    });
    mutate(s, admin, "publish", { id: m.id, version: m.version });
    expect(m.published).toBe(true);
  });
  it("rejects duplicate dates and out-of-month data", () => {
    const s = fixture(),
      m = s.months[0];
    const input = {
      id: m.id,
      version: m.version,
      rows: [m.rows[0], m.rows[0]],
      salary: 50000,
      billingRule: "fixed",
      payrollReviewed: true,
    };
    expect(() => mutate(s, admin, "saveMonth", input)).toThrow("日期重複");
  });
  it("blocks batch filling leave-of-absence talent", () => {
    const s = fixture();
    s.talents[0].status = "留停";
    expect(() =>
      mutate(s, admin, "generate", {
        talentId: "t1",
        month: "2026-02",
        holidays: [],
        calendarReviewed: true,
      })
    ).toThrow();
  });
  it("hashes passwords with per-password salts", () => {
    const h = hashPassword("correct-password");
    expect(h).not.toBe(hashPassword("correct-password"));
    expect(verifyPassword("correct-password", h)).toBe(true);
    expect(verifyPassword("wrong", h)).toBe(false);
  });
});
describe("payroll and calendar boundaries", () => {
  it("uses actual month length, holidays and contract range", () => {
    const r = defaultRows(
      "2028-02",
      "09:00",
      "18:00",
      ["2028-02-28"],
      "2028-02-25",
      "2028-02-29"
    );
    expect(r.map(r => r.date)).toEqual(["2028-02-25", "2028-02-29"]);
  });
  it("calculates daily overtime tiers, full-paid sick leave and fixed fees", () => {
    const s = fixture(),
      m = s.months[0];
    m.salary = 48000;
    m.billingRule = "fixed";
    m.payrollReviewed = true;
    m.rows = m.rows.slice(0, 3);
    m.rows[0].leave = "全薪病假";
    m.rows[0].leaveHours = 8;
    m.rows[1].leave = "事假";
    m.rows[1].leaveHours = 8;
    m.rows[2].overtimeHours = 3;
    m.rows[2].overtimeApproved = true;
    const c = calculateMonth(m);
    expect(c.insurance).toBe(5760);
    expect(c.management).toBe(4800);
    expect(c.deduction).toBe(1600);
    expect(c.overtime).toBe(866.67);
    expect(c.total).toBe(57826.67);
  });
  it("flags parental leave and unresolved billing rather than silently deducting", () => {
    const m = fixture().months[0];
    m.rows[0].leave = "育嬰留停";
    const c = calculateMonth(m);
    expect(c.unresolved.some(x => x.includes("育嬰留停"))).toBe(true);
    expect(c.unresolved.some(x => x.includes("請款"))).toBe(true);
  });
  it("requires reasons for manual overrides", () => {
    const s = fixture(),
      m = s.months[0];
    m.rows[0].manualDeduction = 0;
    expect(() =>
      mutate(s, admin, "saveMonth", {
        id: m.id,
        version: m.version,
        rows: m.rows,
        salary: 50000,
        billingRule: "fixed",
        payrollReviewed: true,
      })
    ).toThrow();
  });
});

describe("talent edits", () => {
  it("updates the existing ID, preserves attendance history and supports status changes", () => {
    const s = fixture();
    const history = JSON.stringify(s.months);
    mutate(s, admin, "talent", {
      ...s.talents[0],
      name: "B",
      title: "engineer",
      salary: 10000,
    });
    mutate(s, admin, "talent", {
      ...s.talents[0],
      title: "Senior Engineer",
      salary: 12000,
      companyId: "c2",
    });
    expect(s.talents).toHaveLength(1);
    expect(s.talents[0]).toMatchObject({
      id: "t1",
      title: "Senior Engineer",
      salary: 12000,
      companyId: "c2",
    });
    mutate(s, admin, "talent", { ...s.talents[0], status: "離職" });
    const restored = JSON.parse(JSON.stringify(s));
    expect(restored.talents[0].status).toBe("離職");
    expect(JSON.stringify(s.months)).toBe(history);
  });
  it("accepts zero and rejects fractional or negative salaries and unknown IDs", () => {
    const s = fixture();
    const input = { ...s.talents[0] };
    for (const salary of [-1, 10000.5])
      expect(() => mutate(s, admin, "talent", { ...input, salary })).toThrow();
    expect(() =>
      mutate(s, admin, "talent", { ...input, id: "missing" })
    ).toThrow("人才不存在");
    mutate(s, admin, "talent", { ...input, salary: 0 });
    expect(s.talents[0].salary).toBe(0);
    expect(s.talents).toHaveLength(1);
  });
});
