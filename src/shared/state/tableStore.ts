import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type TablePage =
  | 'report'
  | 'attendance'
  | 'scoring'
  | 'organization'
  | 'members'
  | 'operational'
  | 'picket-schedule'
  | 'products'
  | 'points'
  | 'points-detail'
  | 'assessments'
  | 'competition'
  | 'branding'
  | 'ristek';

interface TableSortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

interface TableState {
  activePage: TablePage;
  month: number;
  year: number;
  searchQuery: string;
  sortConfig: TableSortConfig | null;
  setActivePage: (page: TablePage) => void;
  setDateRange: (month: number, year: number) => void;
  setSearchQuery: (query: string) => void;
  setSortConfig: (sortConfig: TableSortConfig | null) => void;
  reset: () => void;
}

const initialState = {
  activePage: 'attendance' as TablePage,
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  searchQuery: '',
  sortConfig: null as TableSortConfig | null,
};

export const useTableStore = create<TableState>()(
  devtools(
    (set) => ({
      ...initialState,
      setActivePage: (page) => set({ activePage: page }),
      setDateRange: (month, year) => set({ month, year }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSortConfig: (sortConfig) => set({ sortConfig }),
      reset: () => set(initialState),
    }),
    { name: 'TableStore' }
  )
);
