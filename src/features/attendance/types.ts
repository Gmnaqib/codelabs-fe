export interface LeaveRequestRow {
  _id: string;
  userId: string;
  userName: string;
  startDate: string | Date;
  endDate: string | Date;
  approvalStatus: string;
  type: string;
  reason?: string;
  attachment_url?: string;
}

export interface AttendanceSummaryCounts {
  present: number;
  permit: number;
  sick: number;
  late: number;
  absent: number;
  // Resolved server-side against the dynamic SP setting thresholds (see
  // spSetting.service.ts on the backend) — null when nothing matched.
  sp?: string | null;
}

export interface AttendanceRow {
  _id: string;
  userId: string;
  userName: string;
  changeDevice: string;
  counts: AttendanceSummaryCounts;
}

export type AttendanceTab = 'Permissions' | 'Total Attendance';
