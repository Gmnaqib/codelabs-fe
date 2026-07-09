import { useCallback, useEffect, useState } from 'react';
import { useTableStore } from '@/shared/state';
import { getAllSchedules2 } from '@/services/picket/picketService';
import type { RawPicketSchedule } from '@/services/picket/picketService';
import { wibDayOf, wibDayStart, getWeekRangeInMonth } from '@/shared/utils';

export type PicketStatus = 'picket' | 'no-picket' | 'not-yet';

function weekRange(week: number, year: number, month: number): { start: number; end: number } | null {
  const range = getWeekRangeInMonth(week, year, month);
  if (!range) return null;
  return {
    start: wibDayStart(year, month, range.startDay),
    end: wibDayStart(year, month, range.endDay),
  };
}

export function computePicketStatus(
  schedules: RawPicketSchedule[],
  isChecked: boolean,
  userId: string,
  week: number,
  year: number,
  month: number
): PicketStatus {
  // A completed record is authoritative on its own — a user who already
  // picketed is "picket" regardless of whether we can also locate their
  // schedule assignment below.
  if (isChecked) return 'picket';

  const range = weekRange(week, year, month);
  if (!range) return 'not-yet';
  const { start, end } = range;

  // A calendar week can still contain more than one of a user's
  // recurring schedule occurrences in rare edge cases — take the
  // earliest one within the range as the operative assignment.
  let earliestDay: number | null = null;
  for (const schedule of schedules) {
    if (!schedule.assignedUsers?.some((u) => u._id === userId)) continue;
    const scheduleDay = wibDayOf(new Date(schedule.date));
    if (scheduleDay < start || scheduleDay > end) continue;
    if (earliestDay === null || scheduleDay < earliestDay) {
      earliestDay = scheduleDay;
    }
  }

  if (earliestDay === null) return 'not-yet';

  const todayStart = wibDayOf(new Date());

  if (earliestDay > todayStart) {
    return 'not-yet';
  }

  return 'no-picket';
}

export function usePicketStatus() {
  const month = useTableStore((s) => s.month);
  const year = useTableStore((s) => s.year);
  const [schedules, setSchedules] = useState<RawPicketSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAllSchedules2()
      .then((res) => {
        if (!cancelled) setSchedules(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getStatus = useCallback(
    (isChecked: boolean, userId: string, week: number): PicketStatus =>
      computePicketStatus(schedules, isChecked, userId, week, year, month),
    [schedules, month, year]
  );

  return { getStatus, loading };
}
