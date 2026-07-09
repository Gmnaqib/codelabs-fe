/**
 * Splits a month into real calendar weeks (Monday-Sunday) instead of rigid
 * day-of-month blocks. If day 1 isn't a Monday, week 1 is a short partial
 * week covering day 1 through the Sunday before the first Monday; week 2
 * starts on that first Monday.
 */

function getFirstMonday(year: number, month: number): number {
  const firstDayWeekday = new Date(year, month - 1, 1).getDay(); // 0=Sun..6=Sat
  if (firstDayWeekday === 1) return 1;
  return 1 + ((8 - firstDayWeekday) % 7);
}

export function getWeekOfMonth(day: number, year: number, month: number): number {
  const firstMonday = getFirstMonday(year, month);
  if (day < firstMonday) return 1;
  const base = firstMonday === 1 ? 1 : 2;
  return base + Math.floor((day - firstMonday) / 7);
}

export function getWeekRangeInMonth(
  week: number,
  year: number,
  month: number
): { startDay: number; endDay: number } | null {
  const firstMonday = getFirstMonday(year, month);
  const lastDayOfMonth = new Date(year, month, 0).getDate();

  if (week === 1) {
    if (firstMonday === 1) {
      return { startDay: 1, endDay: Math.min(7, lastDayOfMonth) };
    }
    return { startDay: 1, endDay: firstMonday - 1 };
  }

  const weekIndex = firstMonday === 1 ? week - 1 : week - 2;
  const startDay = firstMonday + weekIndex * 7;
  if (startDay > lastDayOfMonth) return null;
  const endDay = Math.min(startDay + 6, lastDayOfMonth);
  return { startDay, endDay };
}

export function getWeeksInMonth(year: number, month: number): number[] {
  const weeks: number[] = [];
  let week = 1;
  while (getWeekRangeInMonth(week, year, month)) {
    weeks.push(week);
    week++;
  }
  return weeks;
}
