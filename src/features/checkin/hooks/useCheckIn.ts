import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { handleError } from '@/shared/services';
import { getAllUsers } from '@/services/users/userService';
import { getAttendanceToday, postCheckinByAdmin } from '@/services/attendance/attendanceService';

export interface CheckInUser {
  _id: string;
  name: string;
  nim: string;
  role: string;
}

interface RawUser {
  _id: string;
  name?: string;
  nim?: string;
  role?: string;
}

interface RawAttendanceRecord {
  userId: string;
}

export function useCheckIn(enabled: boolean) {
  const [usersWithoutAttendance, setUsersWithoutAttendance] = useState<CheckInUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [allUsers, todayRecords] = await Promise.all([
        getAllUsers() as Promise<RawUser[]>,
        getAttendanceToday() as Promise<RawAttendanceRecord[]>,
      ]);

      const attendedIds = new Set<string>((todayRecords || []).map((a) => String(a.userId)));

      const without: CheckInUser[] = allUsers
        .filter((u) => !attendedIds.has(String(u._id)))
        .map((u) => ({
          _id: String(u._id),
          name: u.name || '',
          nim: u.nim || '',
          role: u.role || '',
        }));

      setUsersWithoutAttendance(without);
    } catch (err) {
      handleError(err);
      toast.error('Gagal memuat data');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    fetchData();
  }, [enabled, fetchData]);

  const handleCheckin = useCallback(
    async (userId: string) => {
      setCheckingIn(userId);
      try {
        await postCheckinByAdmin(userId);
        toast.success('Berhasil check in!');
        await fetchData();
      } catch (err) {
        const appError = handleError(err);
        toast.error(appError.message || 'Gagal check in user');
      }
      setCheckingIn(null);
    },
    [fetchData]
  );

  return { usersWithoutAttendance, loading, checkingIn, handleCheckin, refetch: fetchData };
}
