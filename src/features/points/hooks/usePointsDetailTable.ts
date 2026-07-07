import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTableStore } from '@/shared/state';
import { useTableData } from '@/features/table/hooks';
import { getKPIDetail } from '@/services/kpi/kpiService';
import type { PointsDetailRow } from '@/features/points/types';

interface UsePointsDetailTableOptions {
  fetchTrigger?: number;
}

export function usePointsDetailTable({ fetchTrigger }: UsePointsDetailTableOptions = {}) {
  const searchParams = useSearchParams();
  const masterId = searchParams.get('id');
  const searchQuery = useTableStore((s) => s.searchQuery);

  const { data, loading, error, refetch } = useTableData<PointsDetailRow>(
    async () => {
      if (!masterId) return [];
      const result = (await getKPIDetail(masterId)) as PointsDetailRow | PointsDetailRow[];
      return Array.isArray(result) ? result : [result];
    },
    [masterId, fetchTrigger]
  );

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (item) =>
        item.kpi_item?.toLowerCase().includes(query) ||
        item.label?.toLowerCase().includes(query) ||
        item.point?.toString().includes(query)
    );
  }, [data, searchQuery]);

  return { data: filteredData, loading, error, refetch };
}
