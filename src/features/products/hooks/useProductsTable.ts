import { useMemo } from 'react';
import { useTableStore } from '@/shared/state';
import { useTableData } from '@/features/table/hooks';
import { getProducts } from '@/services/product/productsService';
import type { ProductRow } from '@/features/products/types';

interface UseProductsTableOptions {
  fetchTrigger?: number;
}

export function useProductsTable({ fetchTrigger }: UseProductsTableOptions = {}) {
  const searchQuery = useTableStore((s) => s.searchQuery);

  const { data, loading, error, refetch } = useTableData<ProductRow>(
    () => getProducts() as Promise<ProductRow[]>,
    [fetchTrigger]
  );

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data;
    return data.filter((product) => product.name?.toLowerCase().includes(query));
  }, [data, searchQuery]);

  return { data: filteredData, loading, error, refetch };
}
