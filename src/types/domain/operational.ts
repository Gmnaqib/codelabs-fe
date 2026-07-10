export const OPERATIONAL_TYPES = ['absence', 'picket', 'thematic'] as const;

export type OperationalType = typeof OPERATIONAL_TYPES[number];

export interface OperationalRecord {
  _id: string;
  userId: string;
  type: OperationalType;
  date: string;
  scheduleId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PicketSchedule {
  _id: string;
  date: string;
  description?: string;
  assignedUsers: { _id: string; name: string; nim: string }[];
}
