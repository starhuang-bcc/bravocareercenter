import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  calculateMonth,
  defaultRows,
  leaveKinds,
  type Account,
  type Platform,
  type Month,
} from "../../shared/enterprise";
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    v =>
      !isNaN(Date.parse(v + "T00:00:00Z")) &&
      new Date(v + "T00:00:00Z").toISOString().slice(0, 10) === v
  );
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
export const attendanceSchema = z
  .object({
    date,
    start: z.union([time, z.literal("")]),
    end: z.union([time, z.literal("")]),
    dayType: z.enum(["工作日", "休息日", "國定假日", "例假", "不出勤"]),
    leave: z.enum(leaveKinds),
    leaveHours: z.number().min(0).max(24),
    overtimeHours: z.number().min(0).max(24),
    overtimeApproved: z.boolean(),
    source: z.enum(["後台填寫", "每日打卡", "Excel匯入"]),
    note: z.string().max(1000),
    manualDeduction: z.number().min(0).optional(),
    manualOvertime: z.number().min(0).optional(),
    manualReason: z.string().max(1000).optional(),
  })
  .refine(
    r =>
      (r.manualDeduction === undefined && r.manualOvertime === undefined) ||
      !!r.manualReason?.trim(),
    { message: "手動核定金額須填寫依據" }
  );
export function requireRole(a: Account, ...roles: Account["role"][]) {
  if (!roles.includes(a.role)) throw Error("無權限");
}
export function getMonth(s: Platform, a: Account, id: string) {
  const m = s.months.find(m => m.id === id);
  if (!m) throw Error("找不到出勤表");
  const t = s.talents.find(t => t.id === m.talentId);
  if (
    !t ||
    (a.role === "talent" && a.talentId !== t.id) ||
    (a.role === "company" && (a.companyId !== t.companyId || !m.published))
  )
    throw Error("無權限");
  return m;
}
export function view(s: Platform, a: Account) {
  const talents = s.talents.filter(
    t =>
      a.role === "admin" ||
      (a.role === "company" ? t.companyId === a.companyId : t.id === a.talentId)
  );
  const ids = new Set(talents.map(t => t.id));
  return {
    account: { id: a.id, name: a.name, role: a.role, email: a.email },
    companies: s.companies.filter(
      c => a.role === "admin" || c.id === a.companyId
    ),
    talents: talents.map(t => (a.role === "company" ? { ...t, salary: 0 } : t)),
    months: s.months
      .filter(m => ids.has(m.talentId) && (a.role !== "company" || m.published))
      .map(m => (a.role === "admin" ? m : { ...m, history: undefined })),
    demands: s.demands.filter(
      d =>
        a.role === "admin" ||
        (a.role === "company" && d.companyId === a.companyId)
    ),
    accounts:
      a.role === "admin" ? s.accounts.map(({ passwordHash, ...a }) => a) : [],
    audit: a.role === "admin" ? s.audit.slice(-100) : [],
  };
}
export function audit(s: Platform, a: Account, action: string, entity: string) {
  s.audit.push({ at: new Date().toISOString(), actor: a.id, action, entity });
  s.audit = s.audit.slice(-2000);
}
export function mutate(s: Platform, a: Account, op: string, input: unknown) {
  if (op === "company") {
    requireRole(a, "admin");
    const p = z
      .object({ name: z.string().trim().min(1).max(150) })
      .parse(input);
    s.companies.push({ id: randomUUID(), ...p });
  } else if (op === "talent") {
    requireRole(a, "admin");
    const p = z
      .object({
        id: z.string().optional(),
        companyId: z.string(),
        name: z.string().trim().min(1).max(100),
        title: z.string().max(150),
        salary: z.number().positive().max(10000000),
        start: date,
        end: z.union([date, z.literal("")]),
        status: z.enum(["在職", "留停", "離職"]),
      })
      .parse(input);
    if (
      !s.companies.some(c => c.id === p.companyId) ||
      (p.end && p.end < p.start)
    )
      throw Error("廠商或合約期間錯誤");
    const old = s.talents.find(t => t.id === p.id);
    if (p.id && !old) throw Error("人才不存在");
    if (old) Object.assign(old, p);
    else s.talents.push({ ...p, id: randomUUID() });
  } else if (op === "demand") {
    requireRole(a, "admin", "company");
    const p = z
      .object({
        id: z.string().optional(),
        companyId: z.string(),
        title: z.string().trim().min(1).max(150),
        count: z.number().int().min(1).max(1000),
        nature: z.enum(["正職", "約聘"]),
        description: z.string().max(50000),
        note: z.string().max(5000),
        status: z.enum(["草稿", "已送出", "招募中", "已完成", "已取消"]),
        jd: z
          .object({
            name: z.string().max(200),
            data: z.string().max(7000000),
            type: z.string().max(150),
          })
          .optional(),
      })
      .parse(input);
    if (
      a.role === "company" &&
      (p.companyId !== a.companyId ||
        !["草稿", "已送出", "已取消"].includes(p.status))
    )
      throw Error("無權限");
    if (!s.companies.some(c => c.id === p.companyId)) throw Error("廠商不存在");
    if (p.jd && !/\.(pdf|docx?)$/i.test(p.jd.name))
      throw Error("JD 僅接受 PDF 或 Word");
    const old = s.demands.find(d => d.id === p.id);
    if (p.id && !old) throw Error("需求不存在");
    if (old && old.companyId !== p.companyId) throw Error("無權限");
    if (old) Object.assign(old, p);
    else
      s.demands.push({
        ...p,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
      });
  } else if (op === "generate") {
    requireRole(a, "admin");
    const p = z
      .object({
        talentId: z.string(),
        month,
        start: time.default("09:00"),
        end: time.default("18:00"),
        holidays: z.array(date),
        calendarReviewed: z.literal(true),
      })
      .parse(input);
    const t = s.talents.find(t => t.id === p.talentId);
    if (!t || t.status !== "在職") throw Error("人才非在職");
    let m = s.months.find(m => m.talentId === t.id && m.month === p.month);
    const rows = defaultRows(
      p.month,
      p.start,
      p.end,
      p.holidays,
      t.start,
      t.end
    );
    if (!m) {
      m = {
        id: randomUUID(),
        talentId: t.id,
        month: p.month,
        version: 1,
        rows: [],
        published: false,
        salary: t.salary,
        insuranceRate: 0.12,
        managementRate: 0.1,
        billingRule: "pending",
        payrollReviewed: false,
      };
      s.months.push(m);
    }
    const existing = new Set(m.rows.map(r => r.date));
    const added = rows.filter(r => !existing.has(r.date));
    if (added.length) {
      archive(m);
      m.rows.push(...added);
      invalidate(m);
      m.payrollReviewed = false;
    }
    m.rows.sort((x, y) => x.date.localeCompare(y.date));
  } else if (op === "saveMonth") {
    requireRole(a, "admin");
    const p = z
      .object({
        id: z.string(),
        version: z.number().int(),
        rows: z.array(attendanceSchema).max(62),
        salary: z.number().positive(),
        billingRule: z.enum(["pending", "fixed"]),
        payrollReviewed: z.boolean(),
      })
      .parse(input);
    const m = getMonth(s, a, p.id);
    if (m.version !== p.version) throw Error("資料已更新，請重新載入");
    if (
      p.rows.some(r => !r.date.startsWith(m.month + "-")) ||
      new Set(p.rows.map(r => r.date)).size !== p.rows.length
    )
      throw Error("日期重複或月份錯誤");
    archive(m);
    Object.assign(m, p);
    invalidate(m);
  } else if (op === "sign") {
    requireRole(a, "talent");
    const p = z
      .object({
        id: z.string(),
        version: z.number().int(),
        name: z.string().trim().min(1).max(100),
        image: z
          .string()
          .regex(/^data:image\/png;base64,[A-Za-z0-9+/=]+$/)
          .max(300000),
      })
      .parse(input);
    const m = getMonth(s, a, p.id);
    if (!m.rows.length) throw Error("出勤表不可為空");
    if (m.version !== p.version || m.signature)
      throw Error("版本已變更或已確認");
    m.signature = {
      name: p.name,
      image: p.image,
      at: new Date().toISOString(),
      version: m.version,
    };
    m.correction = undefined;
  } else if (op === "correction") {
    requireRole(a, "talent");
    const p = z
      .object({ id: z.string(), note: z.string().trim().min(1).max(2000) })
      .parse(input);
    const m = getMonth(s, a, p.id);
    m.correction = p.note;
    m.published = false;
  } else if (op === "publish") {
    requireRole(a, "admin");
    const p = z
      .object({ id: z.string(), version: z.number().int() })
      .parse(input);
    const m = getMonth(s, a, p.id);
    if (
      m.version !== p.version ||
      m.signature?.version !== m.version ||
      m.correction ||
      !m.payrollReviewed ||
      calculateMonth(m).unresolved.length
    )
      throw Error("須先完成簽名、出勤／假勤核對及費用規則確認");
    m.published = true;
  } else if (op === "punch") {
    requireRole(a, "talent");
    const p = z.object({ kind: z.enum(["start", "end"]) }).parse(input);
    const t = s.talents.find(t => t.id === a.talentId);
    if (!t || t.status !== "在職") throw Error("人才非在職");
    const now = new Date();
    const stamp = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);
    const d = stamp.slice(0, 10),
      tm = stamp.slice(11, 16);
    if (d < t.start || (t.end && d > t.end)) throw Error("不在合約期間");
    let m = s.months.find(
      m => m.talentId === t.id && m.month === d.slice(0, 7)
    );
    if (!m) {
      m = {
        id: randomUUID(),
        talentId: t.id,
        month: d.slice(0, 7),
        version: 1,
        rows: [],
        published: false,
        salary: t.salary,
        insuranceRate: 0.12,
        managementRate: 0.1,
        billingRule: "pending",
        payrollReviewed: false,
      };
      s.months.push(m);
    }
    let r = m.rows.find(r => r.date === d);
    if (!r) {
      r = {
        date: d,
        start: "",
        end: "",
        dayType: "工作日",
        leave: "無",
        leaveHours: 0,
        overtimeHours: 0,
        overtimeApproved: false,
        source: "每日打卡",
        note: "實際時間；日別及工時待 BRAVO 核對",
      };
      m.rows.push(r);
    }
    if (r.source !== "每日打卡") throw Error("當日已有後台紀錄，請申請更正");
    if (r[p.kind]) throw Error("已打卡，請勿重複");
    if (p.kind === "end" && !r.start)
      throw Error("請先上班打卡；跨日班次請由 BRAVO 補登");
    archive(m);
    r[p.kind] = tm;
    invalidate(m);
    m.payrollReviewed = false;
  } else throw Error("不支援的操作");
  audit(s, a, op, (input as { id?: string })?.id || "");
}
function invalidate(m: Month) {
  m.version++;
  m.signature = undefined;
  m.published = false;
  m.correction = undefined;
}

function archive(m: Month) {
  m.history ??= [];
  m.history.push({
    version: m.version,
    rows: structuredClone(m.rows),
    signature: m.signature ? structuredClone(m.signature) : undefined,
    at: new Date().toISOString(),
  });
}
