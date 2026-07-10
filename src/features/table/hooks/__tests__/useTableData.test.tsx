import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTableData } from '@/features/table/hooks/useTableData';

interface Row {
  id: number;
}

describe('useTableData', () => {
  it('fills data and sets loading to false on success', async () => {
    const fetchFn = vi.fn(async (): Promise<Row[]> => [{ id: 1 }, { id: 2 }]);

    const { result } = renderHook(() => useTableData(fetchFn));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual([{ id: 1 }, { id: 2 }]);
    expect(result.current.error).toBeNull();
    expect(result.current.isEmpty).toBe(false);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('fills error when the fetch function rejects', async () => {
    const fetchFn = vi.fn(async (): Promise<Row[]> => {
      throw new Error('network down');
    });

    const { result } = renderHook(() => useTableData(fetchFn));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe('network down');
    expect(result.current.data).toEqual([]);
    expect(result.current.isEmpty).toBe(true);
  });

  it('refetch calls the fetch function again', async () => {
    const fetchFn = vi.fn(async (): Promise<Row[]> => [{ id: 1 }]);

    const { result } = renderHook(() => useTableData(fetchFn));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchFn).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });

    expect(fetchFn).toHaveBeenCalledTimes(2);
  });
});
