import type { User, OperationalType, OperationalRecord } from '@/types/domain';

export interface OperationalTabProps {
  users: User[];
  loading: boolean;
  searchQuery: string;
  showMenu?: boolean;
}

export type { OperationalType, OperationalRecord };
