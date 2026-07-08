import { useCallback, useState } from 'react';
import { UI_CONFIG } from '@/shared/constants';

interface UsePaginationOptions {
  pageSize?: number;
}

export function usePagination({ pageSize: initialPageSize }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(
    initialPageSize ?? UI_CONFIG.pagination.defaultPageSize
  );

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  const paginated = useCallback(
    <T,>(data: T[]): T[] => {
      const start = (page - 1) * pageSize;
      return data.slice(start, start + pageSize);
    },
    [page, pageSize]
  );

  return { page, pageSize, setPage, setPageSize, paginated };
}
