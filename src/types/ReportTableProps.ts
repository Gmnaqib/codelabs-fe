
export interface ReportTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  researchData?: ResearchDataItem[];
}

export type ResearchItem = {
    createdAt: string;
    week?: number | string;
    progress: string;
  };

export type ResearchDataItem = {
      _id?: string;
      userId?: string;
      name?: string;
      createdAt?: string;
      week?: number | string;
      progress?: string;
      [key: string]: unknown;
    };