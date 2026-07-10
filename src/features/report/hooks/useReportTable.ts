import { useMemo } from 'react';
import { useTableStore } from '@/shared/state';
import { useTableData } from '@/features/table/hooks';
import { getMeResearchRecords } from '@/services/research/researchService';
import type { ReportRow } from '@/features/report/types';

interface UseReportTableOptions {
  filterWeek?: string;
  filterProgress?: string;
  fetchTrigger?: number;
}

export function useReportTable({
  filterWeek = 'All',
  filterProgress = 'All',
  fetchTrigger,
}: UseReportTableOptions = {}) {
  const year = useTableStore((s) => s.year);
  const month = useTableStore((s) => s.month);

  const { data, loading, error, refetch } = useTableData<ReportRow>(
    () => getMeResearchRecords() as Promise<ReportRow[]>,
    [fetchTrigger]
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (!item.createdAt) return false;
      const date = new Date(item.createdAt);
      const matchMonth = date.getMonth() + 1 === month;
      const matchYear = date.getFullYear() === year;
      const matchWeek = filterWeek === 'All' || `Week ${item.week}` === filterWeek;
      const matchProgress =
        filterProgress === 'All' ||
        (typeof item.progress === 'string' && item.progress.toLowerCase() === filterProgress.toLowerCase());
      return matchMonth && matchYear && matchWeek && matchProgress;
    });
  }, [data, month, year, filterWeek, filterProgress]);

  return { data: filteredData, loading, error, refetch, isBackendEmpty: data.length === 0 };
}
