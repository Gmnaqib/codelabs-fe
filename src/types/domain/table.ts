export interface TableRow {
  _id: string;
  [key: string]: unknown;
}

export interface TableSortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

export interface TableFilterConfig {
  column: string;
  value: unknown;
  operator?: 'eq' | 'contains' | 'gt' | 'lt';
}
