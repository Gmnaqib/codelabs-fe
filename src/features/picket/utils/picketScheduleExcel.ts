import ExcelJS from 'exceljs';
import { downloadWorkbookBuffer } from '@/shared/utils';
import { getAllUsers } from '@/services/users/userService';

export const PICKET_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

// How many assignment rows per day get the member-name dropdown — generous
// headroom above what a single day's picket duty would ever need.
const TEMPLATE_ROWS_PER_DAY = 30;

export async function downloadPicketScheduleTemplate(): Promise<void> {
  const activeUsers = await getAllUsers({ activeOnly: true });
  const memberNames = activeUsers.map((u) => u.name).sort((a, b) => a.localeCompare(b));

  const workbook = new ExcelJS.Workbook();

  // Picket Schedule is added first so it's both the first visible tab and
  // worksheets[0] — the sheet parsePicketScheduleExcel reads back.
  const sheet = workbook.addWorksheet('Picket Schedule');
  sheet.addRow([...PICKET_DAYS]);
  sheet.getRow(1).font = { bold: true };
  PICKET_DAYS.forEach((_, idx) => {
    sheet.getColumn(idx + 1).width = 22;
  });

  // Reference sheet so the day columns' dropdown can validate against it —
  // also lets the admin see each member's exact name as registered in the
  // system (which doesn't always match how they're usually addressed).
  const membersSheet = workbook.addWorksheet('Members');
  membersSheet.addRow(['Member Name']);
  membersSheet.getRow(1).font = { bold: true };
  memberNames.forEach((name) => membersSheet.addRow([name]));
  membersSheet.getColumn(1).width = 28;

  const memberRangeEnd = Math.max(memberNames.length + 1, 2);
  for (let row = 2; row <= TEMPLATE_ROWS_PER_DAY + 1; row++) {
    PICKET_DAYS.forEach((_, colIdx) => {
      sheet.getCell(row, colIdx + 1).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`Members!$A$2:$A$${memberRangeEnd}`],
      };
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  downloadWorkbookBuffer(buffer as ArrayBuffer, 'picket-schedule-template.xlsx');
}

// Reads a filled-in copy of the template: one column per weekday, member
// names listed top-to-bottom in each column (blank cells are skipped).
export async function parsePicketScheduleExcel(file: File): Promise<Record<string, string[]>> {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  // Look up by name first so this keeps working even if the workbook's sheet
  // order ever changes; fall back to the first sheet for files that were
  // renamed or built by hand.
  const sheet = workbook.getWorksheet('Picket Schedule') ?? workbook.worksheets[0];
  if (!sheet) {
    throw new Error('The uploaded file has no sheet to read.');
  }

  const dayColumns: Record<number, (typeof PICKET_DAYS)[number]> = {};
  sheet.getRow(1).eachCell((cell, colNumber) => {
    const label = String(cell.value ?? '').trim();
    const match = PICKET_DAYS.find((day) => day.toLowerCase() === label.toLowerCase());
    if (match) dayColumns[colNumber] = match;
  });

  if (Object.keys(dayColumns).length === 0) {
    throw new Error(`No valid day columns found. Expected headers: ${PICKET_DAYS.join(', ')}.`);
  }

  const assignments: Record<string, string[]> = {};
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    Object.entries(dayColumns).forEach(([colNumberStr, day]) => {
      const raw = row.getCell(Number(colNumberStr)).value;
      const name = typeof raw === 'string' ? raw.trim() : raw != null ? String(raw).trim() : '';
      if (!name) return;
      (assignments[day] ??= []).push(name);
    });
  });

  return assignments;
}
