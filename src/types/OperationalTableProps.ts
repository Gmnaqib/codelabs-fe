export interface OperationalTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  month: number;
  year: number;
  headersConfig: Record<string, string[]>;
  checkedState: Record<string, boolean>;
  onToggle: (page: string, rowIndex: number, day: string | number) => void;
  searchQuery?: string;
}