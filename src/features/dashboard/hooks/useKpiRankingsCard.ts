import { useEffect, useState } from 'react';
import { getKPIRankings } from '@/services/kpi/kpiService';
import { handleError } from '@/shared/services';

export interface KPIRankingUser {
  name: string;
  totalPoints: number;
  year: number;
  month: number;
  image?: string | null;
  banner?: string | null;
  frame?: string | null;
}

export function useKpiRankingsCard() {
  const [users, setUsers] = useState<KPIRankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const res = (await getKPIRankings(year, month)) as KPIRankingUser[];
        setUsers(res);
      } catch (err) {
        setError(handleError(err));
      } finally {
        setLoading(false);
      }
    };
    fetchRankings();
  }, []);

  return { users, loading, error };
}
