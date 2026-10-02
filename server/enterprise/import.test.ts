import { it, expect } from "vitest";
import ExcelJS from "exceljs";
import { parseAttendanceWorkbook } from "../../client/src/lib/attendanceImport";
it("imports source-style rows without treating summary balances as attendance", async () => {
  const w = new ExcelJS.Workbook(),
    s = w.addWorksheet("工作表1");
  s.addRow([
    "姓名",
    "出勤日期",
    "上班時間",
    "下班時間",
    "加班上班  時間",
    "加班下班時間",
    "假勤名稱",
    "假勤起始時間",
    "假勤結束時間",
    "請假時數",
  ]);
  s.addRow([
    "小明",
    "2026/01/06",
    "13:30",
    "18:00",
    "",
    "",
    "全薪病假",
    "09:00",
    "12:00",
    3,
  ]);
  s.addRow(["全薪病假", "2025/09/01 ~ 2026/08/31", 90, 25, 65]);
  const b = await w.xlsx.writeBuffer();
  const rows = await parseAttendanceWorkbook(
    b as unknown as ArrayBuffer,
    "小明",
    "2026-01"
  );
  expect(rows).toHaveLength(1);
  expect(rows[0].leaveHours).toBe(3);
  expect(rows[0].leave).toBe("全薪病假");
});
