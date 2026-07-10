import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { useTableStore } from '@/shared/state';
import { useTableData } from '@/features/table/hooks';
import { getAllBranding, updateBrandingStatus } from '@/services/branding/brandingService';
import type { BrandingRow } from '@/features/branding/types';

interface UseBrandingTableOptions {
  filterWeek?: string;
  filterContentType?: string;
}

export function useBrandingTable({
  filterWeek = 'All',
  filterContentType = 'All',
}: UseBrandingTableOptions = {}) {
  const year = useTableStore((s) => s.year);
  const month = useTableStore((s) => s.month);
  const searchQuery = useTableStore((s) => s.searchQuery);

  const { data, loading, error, refetch } = useTableData<BrandingRow>(
    () => {
      const date = `${year}-${String(month).padStart(2, '0')}`;
      return getAllBranding({ date }) as Promise<BrandingRow[]>;
    },
    [year, month]
  );

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return data.filter((item) => {
      let matchMonth = true;
      let matchYear = true;
      if (item.createdAt) {
        const date = new Date(item.createdAt);
        matchMonth = date.getMonth() + 1 === month;
        matchYear = date.getFullYear() === year;
      }

      let matchWeek = true;
      if (filterWeek !== 'All') {
        matchWeek = item.week !== undefined && item.week !== null ? `Week ${item.week}` === filterWeek : false;
      }

      const matchContentType =
        filterContentType === 'All' || item.level === filterContentType || item.research === filterContentType;

      const matchSearch = !query || (item.name?.toLowerCase().includes(query) ?? false);

      return matchMonth && matchYear && matchWeek && matchContentType && matchSearch;
    });
  }, [data, month, year, filterWeek, filterContentType, searchQuery]);

  const handleReview = useCallback(
    async (id: string, status: string) => {
      try {
        await updateBrandingStatus(id, Number(status));
        await refetch();
        toast.success(`Status updated to ${status} successfully!`);
      } catch {
        toast.error('Failed to update branding status.');
      }
    },
    [refetch]
  );

  return { data: filteredData, loading, error, handleReview, isBackendEmpty: data.length === 0 };
}
