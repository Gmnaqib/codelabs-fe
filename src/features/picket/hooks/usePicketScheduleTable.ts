import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  getTodayPicketSchedule,
  getOperationalRecords,
  postOperationalRecord,
  deleteOperationalRecord,
  getUpcomingPicketScheduleForSwap,
  swapPicketUsers,
} from '@/services/picket/picketService';
import type { PicketRow, PicketSwapSchedule } from '@/features/picket/types';

interface RawOperationalRecord {
  _id: string;
  userId: string;
  scheduleId: string;
  type: string;
  date: string | Date;
}

interface UsePicketScheduleTableOptions {
  fetchTrigger?: number;
  // ISO date (yyyy-MM-dd) to view instead of today's schedule.
  date?: string;
}

export function usePicketScheduleTable({ fetchTrigger, date }: UsePicketScheduleTableOptions = {}) {
  const [picketData, setPicketData] = useState<PicketRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkedUsers, setCheckedUsers] = useState<Record<string, boolean>>({});
  const [recordIds, setRecordIds] = useState<Record<string, string>>({});
  const [scheduleId, setScheduleId] = useState('');
  const [rangeSchedules, setRangeSchedules] = useState<PicketSwapSchedule[]>([]);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const data = (await getTodayPicketSchedule(date)) as PicketSwapSchedule[];

      const withUsers = data.filter((d) => d.assignedUsers && d.assignedUsers.length > 0);
      const users = withUsers.length > 0 ? withUsers[0].assignedUsers : [];
      const scheduleIdValue = withUsers.length > 0 ? withUsers[0]._id : '';
      setScheduleId(scheduleIdValue);
      setPicketData(users);

      const operationalRecords = scheduleIdValue
        ? ((await getOperationalRecords({ scheduleId: scheduleIdValue })) as RawOperationalRecord[])
        : [];

      const checked: Record<string, boolean> = {};
      const ids: Record<string, string> = {};
      operationalRecords.forEach((rec) => {
        checked[rec.userId] = true;
        ids[rec.userId] = rec._id;
      });
      setCheckedUsers(checked);
      setRecordIds(ids);

      const todayUserIds = new Set(users.map((u) => u._id));
      const range = (await getUpcomingPicketScheduleForSwap()) as PicketSwapSchedule[];
      const filteredRange = range.map((schedule) => ({
        ...schedule,
        assignedUsers: (schedule.assignedUsers || []).filter((u) => !todayUserIds.has(u._id)),
      }));
      setRangeSchedules(filteredRange);
    } catch {
      setPicketData([]);
      setCheckedUsers({});
      setRangeSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchTrigger, fetchSchedules]);

  const refreshOperationalRecords = useCallback(
    async (forScheduleId: string) => {
      const operationalRecords = (await getOperationalRecords({ scheduleId: forScheduleId })) as RawOperationalRecord[];
      const checked: Record<string, boolean> = {};
      const ids: Record<string, string> = {};
      operationalRecords.forEach((rec) => {
        checked[rec.userId] = true;
        ids[rec.userId] = rec._id;
      });
      setCheckedUsers(checked);
      setRecordIds(ids);
      return operationalRecords;
    },
    []
  );

  const handleToggle = useCallback(
    async (userId: string, checked: boolean) => {
      if (checked && !checkedUsers[userId]) {
        const dateStr = new Date().toISOString();
        await postOperationalRecord({ scheduleId, userId, type: 'picket', date: dateStr });
        await refreshOperationalRecords(scheduleId);
      } else if (!checked && checkedUsers[userId]) {
        const recordId = recordIds[userId];
        if (recordId) {
          await deleteOperationalRecord(recordId);
          setCheckedUsers((prev) => {
            const copy = { ...prev };
            delete copy[userId];
            return copy;
          });
          setRecordIds((prev) => {
            const copy = { ...prev };
            delete copy[userId];
            return copy;
          });
        }
      }
    },
    [checkedUsers, recordIds, scheduleId, refreshOperationalRecords]
  );

  const handleSwap = useCallback(
    async (userId: string, targetScheduleId: string, targetUserId: string) => {
      try {
        await swapPicketUsers({
          schedule1Id: scheduleId,
          schedule1UserId: userId,
          schedule2Id: targetScheduleId,
          schedule2UserId: targetUserId,
        });

        const [targetRecords, userRecords] = await Promise.all([
          getOperationalRecords({ scheduleId: targetScheduleId, userId: targetUserId }) as Promise<RawOperationalRecord[]>,
          getOperationalRecords({ scheduleId, userId }) as Promise<RawOperationalRecord[]>,
        ]);
        if (targetRecords[0]) {
          await deleteOperationalRecord(targetRecords[0]._id);
        }
        if (userRecords[0]) {
          await deleteOperationalRecord(userRecords[0]._id);
        }

        await fetchSchedules();
        toast.success('Picket swapped successfully!');
      } catch (err) {
        console.error('Swap failed', err);
        toast.error('Failed to swap picket!');
      }
    },
    [scheduleId, fetchSchedules]
  );

  return { picketData, loading, checkedUsers, rangeSchedules, handleToggle, handleSwap };
}
