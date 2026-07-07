export interface BrandingRow {
  _id: string;
  name: string;
  status: string | number;
  level: string;
  research: string;
  link: string;
  description: string;
  createdAt?: string;
  week?: number | string;
}
