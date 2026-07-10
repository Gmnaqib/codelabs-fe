import { useCallback, useEffect, useState } from 'react';
import { useTableStore } from '@/shared/state';
import { getAttendance, getAllLeaveRequests } from '@/services/attendance/attendanceService';
import type { RawAttendanceRecord, RawLeaveRequestItem } from '@/services/attendance/attendanceService';
import { handleError } from '@/shared/services';
import { truncateToWIBDay, wibDayOf, wibDayStart, wibNow } from '@/shared/utils';

export type AbsenceStatus = 'checked' | 'sick' | 'permit' | 'absent' | 'future';

export function computeAbsenceStatus(
  attendance: RawAttendanceRecord[],
  leaves: RawLeaveRequestItem[],
  userId: string,
  day: number,
  year: number,
  month: number
): AbsenceStatus {
  const cellStart = wibDayStart(year, month, day);
  const todayStart = truncateToWIBDay(wibNow());

  // A day later than today hasn't happened yet — there is nothing to report,
  // so it should render as blank rather than a false "Absent".
  if (cellStart > todayStart) {
    return 'future';
  }

  const attendanceRecord = attendance.find((r) => {
    if (r.userId !== userId) return false;
    const raw = r.date || r.checkIn;
    if (!raw) return false;
    return wibDayOf(new Date(raw)) === cellStart;
  });

  if (attendanceRecord?.checkIn && attendanceRecord?.checkOut) {
    return 'checked';
  }

  const leaveRecord = leaves.find((l) => {
    if (l.userId !== userId) return false;
    if (l.approval_status !== 'approved' && l.approvalStatus !== 'approved') return false;
    const startRaw = l.start_date || l.startDate;
    const endRaw = l.end_date || l.endDate || startRaw;
    if (!startRaw) return false;
    const start = wibDayOf(new Date(startRaw));
    const end = endRaw ? wibDayOf(new Date(endRaw)) : start;
    return cellStart >= start && cellStart <= end;
  });

  if (leaveRecord?.status === 'sick' || leaveRecord?.type === 'sick') {
    return 'sick';
  }
  if (leaveRecord?.status === 'permit' || leaveRecord?.type === 'permit') {
    return 'permit';
  }

  return 'absent';
}

export function useAbsenceStatus() {
  const month = useTableStore((s) => s.month);
  const year = useTableStore((s) => s.year);

  const [attendance, setAttendance] = useState<RawAttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<RawLeaveRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [attendanceRes, leaveRes] = await Promise.all([
          getAttendance(year, month),
          getAllLeaveRequests(year, month),
        ]);
        if (cancelled) return;
        setAttendance(attendanceRes);
        setLeaves(leaveRes);
      } catch (e) {
        if (!cancelled) setError(handleError(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  const getStatus = useCallback(
    (userId: string, day: number): AbsenceStatus =>
      computeAbsenceStatus(attendance, leaves, userId, day, year, month),
    [attendance, leaves, month, year]
  );

  return { getStatus, loading, error };
}
