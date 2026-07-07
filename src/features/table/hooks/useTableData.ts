import { useCallback, useEffect, useState } from 'react';
import { handleError } from '@/shared/services';

interface UseTableDataOptions<T> {
  skip?: boolean;
  onSuccess?: (d: T[]) => void;
  onError?: (e: Error) => void;
}

interface UseTableDataResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isEmpty: boolean;
}

export function useTableData<T>(
  fetchFn: () => Promise<T[]>,
  deps: unknown[] = [],
  options: UseTableDataOptions<T> = {}
): UseTableDataResult<T> {
  const { skip = false, onSuccess, onError } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (skip) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const appError = handleError(err);
      setError(appError);
      onError?.(appError);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, isEmpty: data.length === 0 };
}
