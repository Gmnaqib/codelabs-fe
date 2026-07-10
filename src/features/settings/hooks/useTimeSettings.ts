import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  getAllTimeSettings,
  updateTimeSetting,
  type TimeSetting,
} from '@/services/timeSetting/timeSettingService';
import { handleError } from '@/shared/services';

export function useTimeSettings() {
  const [settings, setSettings] = useState<TimeSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllTimeSettings();
      setSettings(data);
    } catch (err) {
      setError(handleError(err));
      toast.error('Failed to load time settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveSetting = useCallback(
    async (id: string, payload: Partial<Omit<TimeSetting, '_id' | 'code'>>) => {
      await updateTimeSetting(id, payload);
      await fetchData();
    },
    [fetchData]
  );

  return { settings, loading, error, refetch: fetchData, saveSetting };
}
