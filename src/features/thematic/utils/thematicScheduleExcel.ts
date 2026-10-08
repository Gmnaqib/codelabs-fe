import ExcelJS from 'exceljs';
import { downloadWorkbookBuffer } from '@/shared/utils';
import { getAllUsers } from '@/services/users/userService';
import { THEMATIC_CATEGORIES } from '@/features/thematic/config/categories';

// Headroom for how many members one thematic entry can list, and how many
// entries (rows) the template ships with — generous, not a hard cap.
const MEMBER_COLUMNS = 10;
const TEMPLATE_ROWS = 50;
// How far ahead the Date column's dropdown offers — Sunday is excluded since
// it's never a valid schedule day for any type.
const DATE_RANGE_DAYS = 90;

function getUpcomingValidDates(daysAhead: number): string[] {
  const dates: string[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i <= daysAhead; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0) continue;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${day}`);
  }
  return dates;
}

export interface RawThematicScheduleRow {
  row: number;
  // Raw trimmed text as typed/entered — may be empty, validated by the caller.
  date: string;
  category: string;
  memberNames: string[];
}

export async function downloadThematicScheduleTemplate(): Promise<void> {
  const activeUsers = await getAllUsers({ activeOnly: true });
  const memberNames = activeUsers.map((u) => u.name).sort((a, b) => a.localeCompare(b));

  const workbook = new ExcelJS.Workbook();

  // Thematic Schedule is added first so it's both the first visible tab and
  // worksheets[0] — the sheet parseThematicScheduleExcel reads back.
  const sheet = workbook.addWorksheet('Thematic Schedule');
  const headers = ['Date', 'Category', ...Array.from({ length: MEMBER_COLUMNS }, (_, i) => `Member ${i + 1}`)];
  sheet.addRow(headers);
  sheet.getRow(1).font = { bold: true };
  sheet.getColumn(1).width = 14;
  sheet.getColumn(2).width = 16;
  for (let i = 0; i < MEMBER_COLUMNS; i++) {
    sheet.getColumn(3 + i).width = 22;
  }
  // Text format on the Date column — so a typed "2026-10-08" is kept
  // literally instead of Excel silently converting it into a locale-
  // dependent date serial that could round-trip differently on read-back.
  sheet.getColumn(1).numFmt = '@';

  // Reference sheet so the Member columns' dropdown can validate against it
  // — also lets the admin see each member's exact name as registered in the
  // system (which doesn't always match how they're usually addressed).
  const membersSheet = workbook.addWorksheet('Members');
  membersSheet.addRow(['Member Name']);
  membersSheet.getRow(1).font = { bold: true };
  memberNames.forEach((name) => membersSheet.addRow([name]));
  membersSheet.getColumn(1).width = 28;

  // Reference sheet for the Date column's dropdown — picking from here
  // keeps the format consistent (no free-typed/mis-formatted dates) and
  // Sunday is never offered since it's never a valid schedule day.
  const dateOptions = getUpcomingValidDates(DATE_RANGE_DAYS);
  const datesSheet = workbook.addWorksheet('Dates');
  datesSheet.addRow(['Date']);
  datesSheet.getRow(1).font = { bold: true };
  dateOptions.forEach((d) => datesSheet.addRow([d]));
  datesSheet.getColumn(1).width = 14;

  const memberRangeEnd = Math.max(memberNames.length + 1, 2);
  const dateRangeEnd = Math.max(dateOptions.length + 1, 2);
  // Category list is small and fixed, so an inline formula list is simpler
  // than a reference sheet.
  const categoryFormula = `"${THEMATIC_CATEGORIES.join(',')}"`;
  for (let row = 2; row <= TEMPLATE_ROWS + 1; row++) {
    sheet.getCell(row, 1).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [`Dates!$A$2:$A$${dateRangeEnd}`],
    };
    sheet.getCell(row, 2).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [categoryFormula],
    };
    for (let col = 0; col < MEMBER_COLUMNS; col++) {
      sheet.getCell(row, 3 + col).dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`Members!$A$2:$A$${memberRangeEnd}`],
      };
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  downloadWorkbookBuffer(buffer as ArrayBuffer, 'thematic-schedule-template.xlsx');
}

// Reads a filled-in copy of the template: one row per schedule entry (a
// specific date), with its category and member names across the row. Fully
// blank rows are skipped; partially-filled rows are still returned so the
// caller can report exactly what's missing/invalid on that row.
export async function parseThematicScheduleExcel(file: File): Promise<RawThematicScheduleRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const sheet = workbook.getWorksheet('Thematic Schedule') ?? workbook.worksheets[0];
  if (!sheet) {
    throw new Error('The uploaded file has no sheet to read.');
  }

  let dateCol = -1;
  let categoryCol = -1;
  const memberCols: number[] = [];
  sheet.getRow(1).eachCell((cell, colNumber) => {
    const label = String(cell.value ?? '').trim().toLowerCase();
    if (label === 'date') dateCol = colNumber;
    else if (label === 'category') categoryCol = colNumber;
    else if (label.startsWith('member')) memberCols.push(colNumber);
  });

  if (dateCol === -1 || categoryCol === -1 || memberCols.length === 0) {
    throw new Error('Expected headers: Date, Category, Member 1, Member 2, ...');
  }

  const cellToText = (value: ExcelJS.CellValue): string => {
    if (value instanceof Date) {
      // Dates ExcelJS hands back are UTC-midnight representations of the
      // typed calendar day — UTC getters avoid a day shift in a browser
      // whose local timezone isn't WIB.
      const y = value.getUTCFullYear();
      const m = String(value.getUTCMonth() + 1).padStart(2, '0');
      const d = String(value.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }
    if (typeof value === 'string') return value.trim();
    if (value != null) return String(value).trim();
    return '';
  };

  const rows: RawThematicScheduleRow[] = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const date = cellToText(row.getCell(dateCol).value);
    const category = cellToText(row.getCell(categoryCol).value);
    const memberNames = memberCols
      .map((col) => cellToText(row.getCell(col).value))
      .filter((name) => name.length > 0);

    if (!date && !category && memberNames.length === 0) return; // fully blank row

    rows.push({ row: rowNumber, date, category, memberNames });
  });

  return rows;
}
