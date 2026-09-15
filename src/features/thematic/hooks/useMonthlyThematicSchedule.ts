import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getThematicSchedulesForMonth, swapThematicGroups } from '@/services/thematic/thematicService';
import type { ThematicSwapSchedule } from '@/features/thematic/types';

interface UseMonthlyThematicScheduleOptions {
  year: number;
  month: number;
  fetchTrigger?: number;
  // Skip fetching, e.g. while a different tab (Picket) is active.
  enabled?: boolean;
}

export function useMonthlyThematicSchedule({ year, month, fetchTrigger, enabled = true }: UseMonthlyThematicScheduleOptions) {
  const [schedules, setSchedules] = useState<ThematicSwapSchedule[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSchedules = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const data = (await getThematicSchedulesForMonth(year, month)) as ThematicSwapSchedule[];
      const normalized = (data || [])
        .map((s) => ({ ...s, assignedUsers: s.assignedUsers || [] }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setSchedules(normalized);
    } catch {
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [year, month, enabled]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchTrigger, fetchSchedules]);

  const handleSwap = useCallback(
    async (schedule1Id: string, schedule2Id: string) => {
      try {
        await swapThematicGroups({ schedule1Id, schedule2Id });
        await fetchSchedules();
        toast.success('Thematic team swapped successfully!');
      } catch {
        toast.error('Failed to swap thematic team!');
      }
    },
    [fetchSchedules]
  );

  return { schedules, loading, handleSwap };
}
