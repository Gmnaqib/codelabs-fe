export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'late';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface AttendanceRecord {
  _id: string;
  userId: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  startDate?: string;
  endDate?: string;
  approvalStatus: ApprovalStatus;
  createdAt?: string;
  updatedAt?: string;
}
