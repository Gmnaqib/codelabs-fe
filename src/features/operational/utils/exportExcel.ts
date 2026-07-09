import ExcelJS from 'exceljs';
import { getAllUsers } from '@/services/users/userService';
import { getAttendance, getAllLeaveRequests } from '@/services/attendance/attendanceService';
import { getOperationalRecords } from '@/services/operational/operationalService';
import { getAllTimeSettings } from '@/services/timeSetting/timeSettingService';
import { getAllSchedules2 } from '@/services/picket/picketService';
import { getWeekOfMonth, getWeeksInMonth, toWIB } from '@/shared/utils';
import {
  computeAbsenceStatus,
  computeThematicStatus,
  computePicketStatus,
} from '@/features/operational/hooks';
import {
  ABSENCE_STATUS_LABEL,
  ABSENCE_STATUS_VARIANT,
  THEMATIC_STATUS_LABEL,
  THEMATIC_STATUS_VARIANT,
  PICKET_STATUS_LABEL,
  PICKET_STATUS_VARIANT,
  type StatusVariant,
} from '@/features/operational/config/columns';
import type { User } from '@/types/domain';

const DAYS_IN_TABLE = 31;

const VARIANT_FONT_ARGB: Partial<Record<StatusVariant, string>> = {
  positive: 'FF15803D', // green-700
  negative: 'FFB91C1C', // red-700
};

interface ExportCell {
  label: string;
  variant: StatusVariant;
}

function addStatusSheet(
  workbook: ExcelJS.Workbook,
  name: string,
  users: User[],
  columnLabels: string[],
  getCell: (userId: string, columnIndex: number) => ExportCell,
  getTotal: (userId: string) => number
): void {
  const sheet = workbook.addWorksheet(name);
  sheet.addRow(['NIM', 'Name', ...columnLabels, 'Total']);
  sheet.getRow(1).font = { bold: true };

  for (const user of users) {
    const cells = columnLabels.map((_, idx) => getCell(user._id, idx));
    const row = sheet.addRow([user.nim, user.name, ...cells.map((c) => c.label), getTotal(user._id)]);

    cells.forEach((cell, idx) => {
      const argb = VARIANT_FONT_ARGB[cell.variant];
      if (!argb) return;
      row.getCell(idx + 3).font = { color: { argb } };
    });
  }

  sheet.getColumn(1).width = 14;
  sheet.getColumn(2).width = 24;
  for (let i = 3; i <= columnLabels.length + 3; i++) {
    sheet.getColumn(i).width = 14;
  }
}

function downloadWorkbook(buffer: ArrayBuffer, fileName: string): void {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportOperationalExcel(year: number, month: number): Promise<void> {
  const [users, attendance, leaves, thematicRecords, picketRecords, timeSettings, schedules] =
    await Promise.all([
      getAllUsers() as Promise<User[]>,
      getAttendance(year, month),
      getAllLeaveRequests(year, month),
      getOperationalRecords('thematic', undefined, year, month),
      getOperationalRecords('picket', undefined, year, month),
      getAllTimeSettings(),
      getAllSchedules2(),
    ]);

  const thematicChecked = new Set<string>();
  for (const record of thematicRecords) {
    const day = toWIB(new Date(record.date)).getUTCDate();
    thematicChecked.add(`${record.userId}-${day}`);
  }

  const picketChecked = new Set<string>();
  for (const record of picketRecords) {
    const day = toWIB(new Date(record.date)).getUTCDate();
    const week = getWeekOfMonth(day, year, month);
    picketChecked.add(`${record.userId}-${week}`);
  }

  const workbook = new ExcelJS.Workbook();
  const dayLabels = Array.from({ length: DAYS_IN_TABLE }, (_, i) => String(i + 1));

  addStatusSheet(
    workbook,
    'Absence',
    users,
    dayLabels,
    (userId, idx) => {
      const status = computeAbsenceStatus(attendance, leaves, userId, idx + 1, year, month);
      return { label: ABSENCE_STATUS_LABEL[status], variant: ABSENCE_STATUS_VARIANT[status] };
    },
    (userId) => {
      let count = 0;
      for (let day = 1; day <= DAYS_IN_TABLE; day++) {
        if (computeAbsenceStatus(attendance, leaves, userId, day, year, month) === 'checked') count++;
      }
      return count;
    }
  );

  addStatusSheet(
    workbook,
    'Thematic',
    users,
    dayLabels,
    (userId, idx) => {
      const day = idx + 1;
      const isChecked = thematicChecked.has(`${userId}-${day}`);
      const status = computeThematicStatus(timeSettings, isChecked, day, year, month);
      // Excel blanks out days that haven't happened yet; the live table
      // still shows them as "Not Yet Thematic".
      if (status === 'future') return { label: '', variant: 'pending' };
      return { label: THEMATIC_STATUS_LABEL[status], variant: THEMATIC_STATUS_VARIANT[status] };
    },
    (userId) => {
      let count = 0;
      for (let day = 1; day <= DAYS_IN_TABLE; day++) {
        const isChecked = thematicChecked.has(`${userId}-${day}`);
        if (computeThematicStatus(timeSettings, isChecked, day, year, month) === 'thematic') count++;
      }
      return count;
    }
  );

  const weeks = getWeeksInMonth(year, month);
  const weekLabels = weeks.map((week) => `Week ${week}`);

  addStatusSheet(
    workbook,
    'Picket',
    users,
    weekLabels,
    (userId, idx) => {
      const week = weeks[idx];
      const isChecked = picketChecked.has(`${userId}-${week}`);
      const status = computePicketStatus(schedules, isChecked, userId, week, year, month);
      return { label: PICKET_STATUS_LABEL[status], variant: PICKET_STATUS_VARIANT[status] };
    },
    (userId) => {
      let count = 0;
      for (const week of weeks) {
        const isChecked = picketChecked.has(`${userId}-${week}`);
        if (computePicketStatus(schedules, isChecked, userId, week, year, month) === 'picket') count++;
      }
      return count;
    }
  );

  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `operational-${year}-${String(month).padStart(2, '0')}.xlsx`;
  downloadWorkbook(buffer as ArrayBuffer, fileName);
}
