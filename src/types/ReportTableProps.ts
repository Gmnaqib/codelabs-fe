interface ReportTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  researchData?: Record<string, any>[];
}