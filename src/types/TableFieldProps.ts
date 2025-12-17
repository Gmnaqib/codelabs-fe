export interface TabelFieldProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  month?: number;
  year?: number;
  data?: any[];
  customHeaderConfig?: Record<string, string[]>;
  showMenu?: boolean;
  filterWeek?: string;
  filterProgress?: string;
  searchQuery?: string;
  search?: string;
}