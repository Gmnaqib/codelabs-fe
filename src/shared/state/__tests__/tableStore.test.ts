import { describe, it, expect, beforeEach } from 'vitest';
import { useTableStore } from '@/shared/state/tableStore';

describe('tableStore', () => {
  beforeEach(() => {
    useTableStore.getState().reset();
  });

  it('setActivePage updates the active page', () => {
    useTableStore.getState().setActivePage('scoring');

    expect(useTableStore.getState().activePage).toBe('scoring');
  });

  it('setDateRange updates month and year together', () => {
    useTableStore.getState().setDateRange(5, 2027);

    const state = useTableStore.getState();
    expect(state.month).toBe(5);
    expect(state.year).toBe(2027);
  });

  it('reset restores activePage, month, year, searchQuery and sortConfig to their initial values', () => {
    const now = new Date();

    useTableStore.getState().setActivePage('scoring');
    useTableStore.getState().setDateRange(1, 2020);
    useTableStore.getState().setSearchQuery('john');
    useTableStore.getState().setSortConfig({ column: 'name', direction: 'asc' });

    useTableStore.getState().reset();

    const state = useTableStore.getState();
    expect(state.activePage).toBe('attendance');
    expect(state.month).toBe(now.getMonth() + 1);
    expect(state.year).toBe(now.getFullYear());
    expect(state.searchQuery).toBe('');
    expect(state.sortConfig).toBeNull();
  });
});
