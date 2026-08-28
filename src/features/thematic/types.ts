export interface ThematicRow {
  _id: string;
  name: string;
}

export interface ThematicAssignedUser {
  _id: string;
  name: string;
}

export interface ThematicSwapSchedule {
  _id: string;
  date: string | Date;
  description?: string;
  assignedUsers: ThematicAssignedUser[];
}
