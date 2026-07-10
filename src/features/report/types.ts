export interface ReportRow {
  _id: string;
  title?: string;
  week?: number | string;
  progress?: string;
  status?: number | null;
  link?: string;
  challenge?: string;
  createdAt?: string;
}
