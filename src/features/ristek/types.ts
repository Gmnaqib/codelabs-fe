export interface RistekRow {
  _id: string;
  userId?: { name?: string };
  // A 0-5 review rating, null until reviewed (not an approval-workflow string).
  status?: number | null;
  title?: string;
  week?: string | number;
  progress?: string;
  challenge?: string;
  link?: string;
}
