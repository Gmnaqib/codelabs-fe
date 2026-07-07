import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useTableStore } from '@/shared/state';
import { useTableData } from '@/features/table/hooks';
import { getAllResearchRecords, updateResearchStatus } from '@/services/research/researchService';
import type { RistekRow } from '@/features/ristek/types';

interface UseRistekTableOptions {
  filterSubResearch?: string;
  filterWeek?: string;
}

export function useRistekTable({
  filterSubResearch = 'All SubResearch',
  filterWeek = 'All Week',
}: UseRistekTableOptions = {}) {
  const year = useTableStore((s) => s.year);
  const month = useTableStore((s) => s.month);
  const searchQuery = useTableStore((s) => s.searchQuery);

  const { data, loading, error, refetch } = useTableData<RistekRow>(
    () => getAllResearchRecords(year, month) as Promise<RistekRow[]>,
    [year, month]
  );

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return data
      .filter((item) => !query || (item.userId?.name ?? '').toLowerCase().includes(query))
      .filter((item) =>
        filterSubResearch === 'All SubResearch'
          ? true
          : (item.progress ?? '').toLowerCase() === filterSubResearch.toLowerCase()
      )
      .filter((item) => (filterWeek === 'All Week' ? true : `Week ${item.week}` === filterWeek));
  }, [data, searchQuery, filterSubResearch, filterWeek]);

  const handleReview = useCallback(
    async (id: string, value: string) => {
      try {
        await updateResearchStatus(id, value);
        await refetch();
        toast.success(`Research ${value.toLowerCase()} successfully!`);
      } catch {
        toast.error(`Failed to update research ${value.toLowerCase()}.`);
      }
    },
    [refetch]
  );

  return { data: filteredData, loading, error, handleReview };
}
