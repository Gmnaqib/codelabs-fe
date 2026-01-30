
export type TableFieldDataItem = {
  [key: string]: unknown;
};

export interface TabelFieldProps<T = TableFieldDataItem> {
  activePage: string;
  onPageChange: (menu: string) => void;
  month?: number;
  year?: number;
  data?: T[];
  customHeaderConfig?: Record<string, string[]>;
  showMenu?: boolean;
  filterWeek?: string;
  filterProgress?: string;
  searchQuery?: string;
  search?: string;
}