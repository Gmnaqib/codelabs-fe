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
    () => getMeResearchRecords(year, month) as Promise<ReportRow[]>,
    [fetchTrigger, year, month]
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchWeek = filterWeek === 'All' || `Week ${item.week}` === filterWeek;
      const matchProgress =
        filterProgress === 'All' ||
        (typeof item.progress === 'string' && item.progress.toLowerCase() === filterProgress.toLowerCase());
      return matchWeek && matchProgress;
    });
  }, [data, filterWeek, filterProgress]);

  return { data: filteredData, loading, error, refetch, isBackendEmpty: data.length === 0 };
}
