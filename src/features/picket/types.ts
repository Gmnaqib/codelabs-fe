export interface PicketRow {
  _id: string;
  name: string;
}

export interface PicketAssignedUser {
  _id: string;
  name: string;
}

export interface PicketSwapSchedule {
  _id: string;
  date: string | Date;
  assignedUsers: PicketAssignedUser[];
}
