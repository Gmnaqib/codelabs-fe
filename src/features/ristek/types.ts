export interface RistekRow {
  _id: string;
  userId?: { name?: string };
  status?: string;
  title?: string;
  week?: string | number;
  progress?: string;
  challenge?: string;
  link?: string;
}
