export interface ScoringTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  data?: any[];
}