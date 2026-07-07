export type ScoringTab = 'Research' | 'Operational' | 'Competition' | 'Branding';

export interface ResearchSummary {
  totalApproved?: number;
  totalPoint?: number;
}

export interface OperationalSummary {
  totalAttendance?: number;
  totalTematik?: number;
  totalPicket?: number;
  totalPoint?: number;
}

export interface SummaryRow {
  _id: string;
  label: string;
  total: number;
  point: number;
}

export interface CompetitionRow {
  _id: string;
  name?: string;
  description?: string;
  deadline?: string;
  link?: string;
  type?: string;
  category?: string;
  status?: string;
}

export interface BrandingRow {
  _id: string;
  name?: string;
  description?: string;
  link?: string;
  research?: string;
  level?: string;
  status?: number | string;
}
