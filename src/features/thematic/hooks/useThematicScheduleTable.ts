import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  getTodayThematicSchedule,
  getUpcomingThematicScheduleForSwap,
  swapThematicGroups,
} from '@/services/thematic/thematicService';
import type { ThematicRow, ThematicSwapSchedule } from '@/features/thematic/types';

interface UseThematicScheduleTableOptions {
  fetchTrigger?: number;
  // ISO date (yyyy-MM-dd) to view instead of today's schedule.
  date?: string;
  // Skip fetching, e.g. while a different tab (Picket) is active.
  enabled?: boolean;
}

export function useThematicScheduleTable({ fetchTrigger, date, enabled = true }: UseThematicScheduleTableOptions = {}) {
  const [thematicData, setThematicData] = useState<ThematicRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [scheduleId, setScheduleId] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [rangeSchedules, setRangeSchedules] = useState<ThematicSwapSchedule[]>([]);

  const fetchSchedules = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const data = (await getTodayThematicSchedule(date)) as ThematicSwapSchedule[];

      const withUsers = data.filter((d) => d.assignedUsers && d.assignedUsers.length > 0);
      const users = withUsers.length > 0 ? withUsers[0].assignedUsers : [];
      const scheduleIdValue = withUsers.length > 0 ? withUsers[0]._id : '';
      setScheduleId(scheduleIdValue);
      setThematicData(users);
      setCategory(withUsers.length > 0 ? withUsers[0].description || null : null);

      const range = (await getUpcomingThematicScheduleForSwap()) as ThematicSwapSchedule[];
      // Today's own schedule isn't a valid swap target for itself.
      setRangeSchedules(range.filter((schedule) => schedule._id !== scheduleIdValue));
    } catch {
      setThematicData([]);
      setCategory(null);
      setRangeSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [date, enabled]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchTrigger, fetchSchedules]);

  const handleSwap = useCallback(
    async (targetScheduleId: string) => {
      try {
        await swapThematicGroups({ schedule1Id: scheduleId, schedule2Id: targetScheduleId });
        await fetchSchedules();
        toast.success('Berhasil mengganti tim tematik!');
      } catch (err) {
        console.error('Swap failed', err);
        toast.error('Gagal mengganti tim tematik!');
      }
    },
    [scheduleId, fetchSchedules]
  );

  return { thematicData, loading, category, rangeSchedules, handleSwap };
}
