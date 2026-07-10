export interface PointsRow {
  _id: string;
  kementerian: string;
  point: number;
  utilized?: number;
}

export interface PointsDetailRow {
  _id: string;
  kpi_item: string;
  point: number;
  label: string;
  max_activity: number;
}
