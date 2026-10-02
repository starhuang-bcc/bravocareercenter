import ExcelJS from "exceljs";
import type { Attendance } from "@shared/enterprise";
import { leaveKinds } from "@shared/enterprise";
function text(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && !(value instanceof Date)) {
    if ("result" in value) return text(value.result as ExcelJS.CellValue);
    if ("richText" in value) return value.richText.map(x => x.text).join("");
    throw Error("不支援的 Excel 儲存格");
  }
  return String(value).trim();
}
function asDate(v: ExcelJS.CellValue) {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const raw = text(v).replace(/\//g, "-");
  const match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return "";
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}
function asTime(v: ExcelJS.CellValue) {
  if (v instanceof Date) return v.toISOString().slice(11, 16);
  if (typeof v === "number") {
    const min = Math.round(v * 1440) % 1440;
    return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
  }
  const raw = text(v);
  if (!raw) return "";
  const m = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!m || Number(m[1]) > 23 || Number(m[2]) > 59) throw Error("時間格式錯誤");
  return `${m[1].padStart(2, "0")}:${m[2]}`;
}
export async function parseAttendanceWorkbook(
  buffer: ArrayBuffer,
  name: string,
  month: string
): Promise<Attendance[]> {
  const w = new ExcelJS.Workbook();
  await w.xlsx.load(buffer);
  const sheet = w.worksheets[0];
  if (!sheet || sheet.rowCount > 5000)
    throw Error("工作表不存在或超過 5000 列");
  const headers = new Map<string, number>();
  sheet
    .getRow(1)
    .eachCell((cell, col) =>
      headers.set(text(cell.value).replace(/\s/g, ""), col)
    );
  const required = [
    "姓名",
    "出勤日期",
    "上班時間",
    "下班時間",
    "加班上班時間",
    "加班下班時間",
    "假勤名稱",
    "假勤起始時間",
    "假勤結束時間",
    "請假時數",
  ];
  if (required.some(h => !headers.has(h)))
    throw Error("Excel 標題須符合出勤範例的 10 個欄位");
  const rows: Attendance[] = [];
  const used = new Set<string>();
  for (let i = 2; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);
    const get = (h: string) => row.getCell(headers.get(h)!).value;
    const date = asDate(get("出勤日期"));
    if (!date) continue;
    if (text(get("姓名")) !== name) continue;
    if (!date.startsWith(month + "-")) throw Error(`第 ${i} 列不在選定月份`);
    if (used.has(date)) throw Error(`第 ${i} 列日期重複`);
    used.add(date);
    const rawLeave = text(get("假勤名稱")) || "無";
    if (!leaveKinds.includes(rawLeave as (typeof leaveKinds)[number]))
      throw Error(`第 ${i} 列假別未設定：${rawLeave}`);
    const leaveHours = Number(text(get("請假時數")) || 0);
    if (!Number.isFinite(leaveHours) || leaveHours < 0 || leaveHours > 24)
      throw Error(`第 ${i} 列請假時數錯誤`);
    const otStart = asTime(get("加班上班時間")),
      otEnd = asTime(get("加班下班時間"));
    let overtimeHours = 0;
    if (otStart || otEnd) {
      if (!otStart || !otEnd) throw Error(`第 ${i} 列加班時間不完整`);
      const minutes = (v: string) =>
        Number(v.slice(0, 2)) * 60 + Number(v.slice(3));
      overtimeHours = (minutes(otEnd) - minutes(otStart)) / 60;
      if (overtimeHours < 0) throw Error(`第 ${i} 列跨日加班請人工核對`);
    }
    rows.push({
      date,
      start: asTime(get("上班時間")),
      end: asTime(get("下班時間")),
      dayType: "工作日",
      leave: rawLeave as Attendance["leave"],
      leaveHours,
      overtimeHours,
      overtimeApproved: false,
      source: "Excel匯入",
      note: "日別、休息時間與加班時數待核對",
    });
  }
  if (!rows.length) throw Error("找不到符合人才姓名與月份的出勤紀錄");
  return rows;
}
