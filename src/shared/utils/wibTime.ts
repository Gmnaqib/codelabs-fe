const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

/**
 * Shifts a raw (unshifted) Date/instant so its UTC getters (getUTCFullYear/getUTCMonth/
 * getUTCDate/getUTCHours/getUTCMinutes/getUTCDay/...) reflect the wall-clock time in
 * Asia/Jakarta (WIB, UTC+7), regardless of the runtime's own system/browser timezone.
 * Matches the manual UTC+7 offset already used by the dashboard clock in AttendanceCard.tsx.
 */
export function toWIB(date: Date): Date {
  return new Date(date.getTime() + WIB_OFFSET_MS);
}

/** The current instant, already shifted — read its UTC getters directly for WIB wall-clock fields. */
export function wibNow(): Date {
  return toWIB(new Date());
}

/** UTC-ms timestamp for midnight WIB on the given WIB calendar day. */
export function wibDayStart(year: number, month: number, day: number): number {
  return Date.UTC(year, month - 1, day);
}

/**
 * Truncates an ALREADY WIB-shifted Date (e.g. the result of `wibNow()` or `toWIB(...)`)
 * down to midnight of its WIB calendar day. Do not pass a raw/unshifted Date here —
 * use `wibDayOf` for that instead.
 */
export function truncateToWIBDay(wibShiftedDate: Date): number {
  return Date.UTC(wibShiftedDate.getUTCFullYear(), wibShiftedDate.getUTCMonth(), wibShiftedDate.getUTCDate());
}

/** Given a raw (unshifted) Date/instant, returns the WIB calendar day it falls on. */
export function wibDayOf(rawDate: Date): number {
  return truncateToWIBDay(toWIB(rawDate));
}

/** "YYYY-MM-DD" for today's WIB calendar day — for query params expecting a calendar date. */
export function wibTodayDateString(): string {
  const now = wibNow();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
}
