export interface PicketRow {
  _id: string;
  name: string;
}

// Mirrors MAX_PICKET_USERS_PER_DAY on the backend (schedule.service.ts) —
// how many of a day's assignedUsers are shown/active after rotation.
export const MAX_PICKET_USERS_PER_DAY = 6;

export interface PicketAssignedUser {
  _id: string;
  name: string;
}

export interface PicketSwapSchedule {
  _id: string;
  date: string | Date;
  assignedUsers: PicketAssignedUser[];
}
