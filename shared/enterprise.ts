export type Role = "admin" | "company" | "talent";
export type Account = {
  id: string;
  email: string;
  name: string;
  role: Role;
  companyId?: string;
  talentId?: string;
  passwordHash: string;
  active: boolean;
};
export type Company = { id: string; name: string };
export type Talent = {
  id: string;
  companyId: string;
  name: string;
  title: string;
  salary: number;
  start: string;
  end: string;
  status: "在職" | "留停" | "離職";
};
export const leaveKinds = [
  "無",
  "事假",
  "普通病假",
  "全薪病假",
  "特休",
  "彈性假",
  "婚假",
  "喪假",
  "產檢假",
  "陪產檢及陪產假",
  "生理假",
  "家庭照顧假",
  "產假",
  "流產假",
  "安胎休養",
  "公假",
  "公傷病假",
  "育嬰留停",
] as const;
export type Attendance = {
  date: string;
  start: string;
  end: string;
  dayType: "工作日" | "休息日" | "國定假日" | "例假" | "不出勤";
  leave: (typeof leaveKinds)[number];
  leaveHours: number;
  overtimeHours: number;
  overtimeApproved: boolean;
  source: "後台填寫" | "每日打卡" | "Excel匯入";
  note: string;
  manualDeduction?: number;
  manualOvertime?: number;
  manualReason?: string;
};
export type Month = {
  id: string;
  talentId: string;
  month: string;
  version: number;
  rows: Attendance[];
  history?: {
    version: number;
    rows: Attendance[];
    signature?: Month["signature"];
    at: string;
  }[];
  signature?: { name: string; image: string; at: string; version: number };
  published: boolean;
  correction?: string;
  salary: number;
  insuranceRate: number;
  managementRate: number;
  billingRule: "pending" | "fixed";
  payrollReviewed: boolean;
};
export type Demand = {
  id: string;
  companyId: string;
  title: string;
  count: number;
  nature: "正職" | "約聘";
  description: string;
  note: string;
  status: "草稿" | "已送出" | "招募中" | "已完成" | "已取消";
  jd?: { name: string; data: string; type: string };
  createdAt: string;
};
export type Platform = {
  accounts: Account[];
  companies: Company[];
  talents: Talent[];
  months: Month[];
  demands: Demand[];
  audit: { at: string; actor: string; action: string; entity: string }[];
};
export const emptyPlatform = (): Platform => ({
  accounts: [],
  companies: [],
  talents: [],
  months: [],
  demands: [],
  audit: [],
});
export const roundMoney = (n: number) =>
  Math.round((n + Number.EPSILON) * 100) / 100;
export function calculateMonth(m: Month) {
  const hourly = m.salary / 240;
  let deduction = 0,
    overtime = 0;
  const unresolved: string[] = [];
  for (const r of m.rows) {
    if (r.manualDeduction !== undefined) deduction += r.manualDeduction;
    else if (["事假", "家庭照顧假"].includes(r.leave))
      deduction += hourly * r.leaveHours;
    else if (r.leave === "普通病假" || r.leave === "生理假") {
      // Annual eligibility must be reviewed; do not infer annual balances from one month.
      deduction += hourly * r.leaveHours * 0.5;
      if (!m.payrollReviewed)
        unresolved.push(`${r.date}：病假年度額度／生理假條件待核對`);
    } else if (
      ["產假", "流產假", "安胎休養", "公傷病假", "育嬰留停"].includes(r.leave)
    )
      unresolved.push(`${r.date}：${r.leave}需核定金額`);
    if (
      [
        "全薪病假",
        "特休",
        "彈性假",
        "婚假",
        "喪假",
        "產檢假",
        "陪產檢及陪產假",
        "公假",
      ].includes(r.leave) &&
      !m.payrollReviewed
    )
      unresolved.push(`${r.date}：有薪假資格與額度待核對`);
    if (r.manualOvertime !== undefined) overtime += r.manualOvertime;
    else if (r.overtimeHours > 0) {
      if (!r.overtimeApproved) {
        unresolved.push(`${r.date}：加班待核定`);
        continue;
      }
      const h = r.overtimeHours;
      if (r.dayType === "工作日" && h <= 4)
        overtime +=
          hourly * ((Math.min(h, 2) * 4) / 3 + (Math.max(h - 2, 0) * 5) / 3);
      else if (r.dayType === "休息日" && h <= 12)
        overtime +=
          hourly *
          ((Math.min(h, 2) * 4) / 3 +
            (Math.min(Math.max(h - 2, 0), 6) * 5) / 3 +
            (Math.max(h - 8, 0) * 8) / 3);
      else unresolved.push(`${r.date}：假日／特殊加班需核定金額`);
    }
  }
  const insurance = m.salary * m.insuranceRate;
  const management = m.salary * m.managementRate;
  if (m.billingRule === "pending") unresolved.push("廠商請款調整基準尚未確認");
  return {
    hourly: roundMoney(hourly),
    salary: m.salary,
    insurance: roundMoney(insurance),
    management: roundMoney(management),
    deduction: roundMoney(deduction),
    overtime: roundMoney(overtime),
    total: roundMoney(m.salary + insurance + management - deduction + overtime),
    unresolved: Array.from(new Set(unresolved)),
  };
}
export function monthDates(month: string): string[] {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw Error("月份格式錯誤");
  const [y, m] = month.split("-").map(Number);
  return Array.from(
    { length: new Date(Date.UTC(y, m, 0)).getUTCDate() },
    (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`
  );
}
export function defaultRows(
  month: string,
  start: string,
  end: string,
  holidays: string[],
  employmentStart: string,
  employmentEnd: string
) {
  return monthDates(month)
    .filter(date => {
      const day = new Date(date + "T00:00:00Z").getUTCDay();
      return (
        day !== 0 &&
        day !== 6 &&
        !holidays.includes(date) &&
        date >= employmentStart &&
        (!employmentEnd || date <= employmentEnd)
      );
    })
    .map(date => ({
      date,
      start,
      end,
      dayType: "工作日" as const,
      leave: "無" as const,
      leaveHours: 0,
      overtimeHours: 0,
      overtimeApproved: false,
      source: "後台填寫" as const,
      note: "班表預填，待本人確認",
    }));
}
