import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useTableStore } from '@/shared/state';
import { useTableData } from '@/features/table/hooks';
import { getAllCompetition, updateCompetitionStatus } from '@/services/competition/competitionService';
import type { CompetitionRow } from '@/features/competition/types';

export function useCompetitionTable() {
  const year = useTableStore((s) => s.year);
  const month = useTableStore((s) => s.month);
  const searchQuery = useTableStore((s) => s.searchQuery);

  const { data, loading, error, refetch } = useTableData<CompetitionRow>(
    () => {
      const date = `${year}-${String(month).padStart(2, '0')}`;
      return getAllCompetition({ date }) as Promise<CompetitionRow[]>;
    },
    [year, month]
  );

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data;
    return data.filter((item) => item.name?.toLowerCase().includes(query));
  }, [data, searchQuery]);

  const handleReview = useCallback(
    async (id: string, status: string) => {
      try {
        await updateCompetitionStatus(id, status);
        await refetch();
        toast.success(`Competition ${status.toLowerCase()} successfully!`);
      } catch {
        toast.error(`Failed to update competition ${status.toLowerCase()}.`);
      }
    },
    [refetch]
  );

  return { data: filteredData, loading, error, handleReview };
}
