export interface AssessmentRow {
  _id: string;
  userId: string;
  rank: number;
  name?: string;
  totalPoints?: number;
}

export interface KPIDetailSummary {
  research?: {
    personal?: { count?: number; totalPoints?: number };
    product?: { count?: number; totalPoints?: number };
    workshop?: { count?: number; totalPoints?: number };
  };
  operational?: {
    picket?: { count?: number; totalPoints?: number };
    thematic?: { count?: number; totalPoints?: number };
  };
  attendance?: {
    present?: { count?: number; totalPoints?: number };
  };
  branding?: { count?: number; totalPoints?: number };
  competition?: { count?: number; totalPoints?: number };
}
