import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useTableStore } from '@/shared/state';
import { useTableData } from '@/features/table/hooks';
import { getAllResearchRecords, updateResearchStatus } from '@/services/research/researchService';
import { RESEARCH_STATUS_LABELS } from '@/shared/constants';
import type { RistekRow } from '@/features/ristek/types';

interface UseRistekTableOptions {
  filterWeek?: string;
}

export function useRistekTable({
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
      .filter((item) => (filterWeek === 'All Week' ? true : `Week ${item.week}` === filterWeek));
  }, [data, searchQuery, filterWeek]);

  const handleReview = useCallback(
    async (id: string, value: number) => {
      const label = RESEARCH_STATUS_LABELS[value] ?? String(value);
      try {
        await updateResearchStatus(id, value);
        await refetch();
        toast.success(`Research reviewed as "${label}" successfully!`);
      } catch {
        toast.error('Failed to update research review.');
      }
    },
    [refetch]
  );

  return { data: filteredData, loading, error, handleReview, isBackendEmpty: data.length === 0 };
}
