import { useEffect, useState } from 'react';
import { getKPIMeRankings } from '@/services/kpi/kpiService';
import { handleError } from '@/shared/services';

interface KpiMeRanking {
  totalPoints: number;
  rank?: number;
}

export function useMonthlyProgressCard() {
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [rank, setRank] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const fetchKPI = async () => {
      try {
        const data = (await getKPIMeRankings(year, month)) as KpiMeRanking;
        setTotalPoints(data.totalPoints);
        setRank(data.rank ?? null);
      } catch (err) {
        setError(handleError(err));
        setTotalPoints(0);
        setRank(null);
      }
    };
    fetchKPI();
  }, []);

  return { totalPoints, rank, error };
}
