import { useMemo } from 'react';
import { useTableStore } from '@/shared/state';
import { useTableData } from '@/features/table/hooks';
import { getSPSettings } from '@/services/spSetting/spSettingService';
import type { SPSettingRow } from '@/features/spSetting/types';

interface UseSPSettingTableOptions {
  fetchTrigger?: number;
}

export function useSPSettingTable({ fetchTrigger }: UseSPSettingTableOptions = {}) {
  const searchQuery = useTableStore((s) => s.searchQuery);

  const { data, loading, error, refetch } = useTableData<SPSettingRow>(
    () => getSPSettings() as Promise<SPSettingRow[]>,
    [fetchTrigger]
  );

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data;
    return data.filter((setting) => setting.name?.toLowerCase().includes(query));
  }, [data, searchQuery]);

  return { data: filteredData, loading, error, refetch };
}
