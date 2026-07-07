export { OPERATIONAL_TYPES } from '@/types/domain/operational';
export type { OperationalType } from '@/types/domain/operational';
import type { OperationalType } from '@/types/domain/operational';

export const OPERATIONAL_LABELS: Record<OperationalType, string> = {
  absence: 'Absensi',
  picket: 'Piket',
  thematic: 'Tematik',
};

export const WEEK_TO_DATE: Record<number, number> = {
  1: 1,
  2: 8,
  3: 15,
  4: 22,
  5: 29,
};

export const getDateFromWeek = (week: number): number => {
  const d = WEEK_TO_DATE[week];
  if (!d) throw new Error(`Invalid week: ${week}`);
  return d;
};
