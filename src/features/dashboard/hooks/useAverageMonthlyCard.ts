import { useEffect, useState } from 'react';
import { getKPIRankings } from '@/services/kpi/kpiService';
import { handleError } from '@/shared/services';

interface RankingItem {
  totalPoints?: number;
}

export function useAverageMonthlyCard() {
  const [average, setAverage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAverage = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const data = (await getKPIRankings(year, month)) as RankingItem[];
        if (Array.isArray(data) && data.length > 0) {
          const total = data.reduce((sum, user) => sum + (user.totalPoints || 0), 0);
          setAverage(Math.round(total / data.length));
        } else {
          setAverage(0);
        }
      } catch (err) {
        setError(handleError(err));
        setAverage(0);
      } finally {
        setLoading(false);
      }
    };
    fetchAverage();
  }, []);

  return { average, loading, error };
}
