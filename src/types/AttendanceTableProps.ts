export interface AttendanceTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  month?: number;
  year?: number;
  searchQuery?: string;
}