import { useCallback, useMemo } from 'react';
import { useTableStore } from '@/shared/state';
import { useTableData } from '@/features/table/hooks';
import { getKPIMaster, getKPIDetail } from '@/services/kpi/kpiService';
import type { PointsRow } from '@/features/points/types';

interface KPIDetailItem {
  point: number;
  label: string;
}

interface UsePointsTableOptions {
  fetchTrigger?: number;
}

export function usePointsTable({ fetchTrigger }: UsePointsTableOptions = {}) {
  const searchQuery = useTableStore((s) => s.searchQuery);

  const fetchKpiWithUtilization = useCallback(async () => {
    const data = (await getKPIMaster()) as PointsRow[];
    const withUtilized = await Promise.all(
      data.map(async (item) => {
        try {
          const details = (await getKPIDetail(item._id)) as KPIDetailItem[];
          const utilized = (Array.isArray(details) ? details : [])
            .filter((d) => d.label === 'REQUIRED')
            .reduce((sum, d) => sum + d.point, 0);
          return { ...item, utilized };
        } catch {
          return { ...item, utilized: 0 };
        }
      })
    );
    return withUtilized;
  }, []);

  const { data, loading, error, refetch } = useTableData<PointsRow>(fetchKpiWithUtilization, [fetchTrigger]);

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (item) => item.kementerian?.toLowerCase().includes(query) || item.point?.toString().includes(query)
    );
  }, [data, searchQuery]);

  return { data: filteredData, loading, error, refetch };
}
