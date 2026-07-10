export { OPERATIONAL_TYPES } from '@/types/domain/operational';
export type { OperationalType } from '@/types/domain/operational';
import type { OperationalType } from '@/types/domain/operational';

export const OPERATIONAL_LABELS: Record<OperationalType, string> = {
  absence: 'Absensi',
  picket: 'Piket',
  thematic: 'Tematik',
};

