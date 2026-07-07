import { useMemo } from 'react';
import { useTableStore } from '@/shared/state';
import { useTableData } from '@/features/table/hooks';
import { getKPIRankings } from '@/services/kpi/kpiService';
import type { AssessmentRow } from '@/features/assessments/types';

interface RawRankingItem {
  userId: string;
  name?: string;
  monthly?: number | string;
  totalPoints?: number;
}

export function useAssessmentsTable() {
  const year = useTableStore((s) => s.year);
  const month = useTableStore((s) => s.month);
  const searchQuery = useTableStore((s) => s.searchQuery);

  const { data, loading, error } = useTableData<AssessmentRow>(
    async () => {
      const res = (await getKPIRankings(year, month)) as RawRankingItem[];
      const arr = Array.isArray(res) ? res : [];
      const sorted = [...arr].sort(
        (a, b) => Number(b.monthly ?? b.totalPoints ?? 0) - Number(a.monthly ?? a.totalPoints ?? 0)
      );
      return sorted.map((item, i) => ({
        _id: item.userId,
        userId: item.userId,
        rank: i + 1,
        name: item.name,
        totalPoints: item.totalPoints,
      }));
    },
    [year, month]
  );

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.userId?.toLowerCase().includes(query) ||
        item.totalPoints?.toString().includes(query)
    );
  }, [data, searchQuery]);

  return { data: filteredData, loading, error, year, month };
}
