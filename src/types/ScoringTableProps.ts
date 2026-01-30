
export type ScoringDataItem = {
  _id?: string;
  userId?: string;
  name?: string;
  score?: number;
  [key: string]: unknown;
};

export interface ScoringTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  data?: ScoringDataItem[];
}