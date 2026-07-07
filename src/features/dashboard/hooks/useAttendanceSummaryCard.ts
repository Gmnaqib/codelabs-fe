import { useEffect, useState } from 'react';
import { handleError } from '@/shared/services';

interface AttendanceTodayItem {
  userId: string;
  reason?: string;
  checkIn?: string | Date | null;
}

interface UserItem {
  _id: string;
  name?: string;
  status?: string;
}

interface AttendanceSummaryItem {
  userId: string;
  userName?: string;
  counts?: { permit?: number; sick?: number };
}

export interface LateTodayEntry {
  name: string;
  reason: string;
}

export interface ExceededEntry {
  name: string;
  count: number;
  reason?: string;
}

export function useAttendanceSummaryCard() {
  const [lateTodayCount, setLateTodayCount] = useState(0);
  const [lateTodayList, setLateTodayList] = useState<LateTodayEntry[]>([]);
  const [absentCount, setAbsentCount] = useState(0);
  const [absentNames, setAbsentNames] = useState<string[]>([]);
  const [leaveExceededCount, setLeaveExceededCount] = useState(0);
  const [sickExceededCount, setSickExceededCount] = useState(0);
  const [leaveExceededList, setLeaveExceededList] = useState<ExceededEntry[]>([]);
  const [sickExceededList, setSickExceededList] = useState<ExceededEntry[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAttendanceAndUsers() {
      try {
        const [attendanceService, userService] = await Promise.all([
          import('@/services/attendance/attendanceService'),
          import('@/services/users/userService'),
        ]);
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const [attendanceData, allUsers, attendanceSummary] = await Promise.all([
          attendanceService.getAttendanceToday() as Promise<AttendanceTodayItem[]>,
          userService.getAllUsers() as Promise<UserItem[]>,
          attendanceService.getAttendanceSummary(year, month) as Promise<AttendanceSummaryItem[]>,
        ]);

        let lateCount = 0;
        let lateList: LateTodayEntry[] = [];
        if (Array.isArray(attendanceData) && Array.isArray(allUsers)) {
          const lateEntries = attendanceData.filter(
            (item) => item.reason && item.checkIn !== null && item.reason.trim() !== ''
          );
          lateCount = lateEntries.length;
          const userMap = new Map(allUsers.map((u) => [u._id, u.name]));
          lateList = lateEntries.map((item) => ({
            name: userMap.get(item.userId) || '-',
            reason: item.reason ?? '',
          }));
        }
        setLateTodayCount(lateCount);
        setLateTodayList(lateList);

        const activeUsers = Array.isArray(allUsers)
          ? allUsers.filter((user) => user.status === 'active')
          : [];
        const attendanceUserIds = Array.isArray(attendanceData)
          ? attendanceData.map((item) => item.userId)
          : [];
        const absentUsers = activeUsers.filter((user) => !attendanceUserIds.includes(user._id));
        setAbsentCount(absentUsers.length);
        setAbsentNames(absentUsers.map((user) => user.name || '-'));

        const leaveExceeded = Array.isArray(attendanceSummary)
          ? attendanceSummary.filter((item) => item.counts && item.counts.permit && item.counts.permit > 2)
          : [];
        setLeaveExceededCount(leaveExceeded.length);
        setLeaveExceededList(
          leaveExceeded.map((item) => ({ name: item.userName || '-', count: item.counts?.permit ?? 0 }))
        );

        const sickExceeded = Array.isArray(attendanceSummary)
          ? attendanceSummary.filter((item) => item.counts && item.counts.sick && item.counts.sick > 4)
          : [];
        setSickExceededCount(sickExceeded.length);
        setSickExceededList(
          sickExceeded.map((item) => {
            let reason = '';
            if (Array.isArray(attendanceData)) {
              const userAttendances = attendanceData.filter(
                (a) => a.userId === item.userId && a.reason && a.reason.trim() !== ''
              );
              if (userAttendances.length > 0) {
                reason = userAttendances[0].reason ?? '';
              }
            }
            return { name: item.userName || '-', count: item.counts?.sick ?? 0, reason };
          })
        );
      } catch (err) {
        setError(handleError(err));
        setLateTodayCount(0);
        setAbsentCount(0);
        setLeaveExceededCount(0);
        setSickExceededCount(0);
      }
    }
    fetchAttendanceAndUsers();
  }, []);

  return {
    lateTodayCount,
    lateTodayList,
    absentCount,
    absentNames,
    leaveExceededCount,
    sickExceededCount,
    leaveExceededList,
    sickExceededList,
    error,
  };
}
