import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";
import { wibNow, wibTodayDateString } from "@/shared/utils";

export async function postLeaveRequest({ type, reason, attachment, start_date, end_date }: {
  type: 'sick' | 'permit';
  reason: string;
  attachment: File | Blob;
  start_date: string;
  end_date: string;
}): Promise<unknown> {
  try {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('reason', reason);
    formData.append('attachment', attachment);
    formData.append('start_date', start_date);
    formData.append('end_date', end_date);

    const { data } = await axiosClient.post('/attendance/leave-requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function postLeaveRequestByOperational({ userId, type, reason, attachment, start_date, end_date }: {
  userId: string;
  type: 'sick' | 'permit';
  reason: string;
  attachment: File | Blob;
  start_date: string;
  end_date: string;
}): Promise<unknown> {
  try {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('type', type);
    formData.append('reason', reason);
    formData.append('attachment', attachment);
    formData.append('start_date', start_date);
    formData.append('end_date', end_date);

    const { data } = await axiosClient.post('/attendance/leave-requests-by-operational', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export interface RawAttendanceUserSummary {
  statusSummary?: {
    status: string;
    records?: { date: string; reason?: string; approvalStatus?: string }[];
  }[];
  [key: string]: unknown;
}

export async function getAttendanceSummaryByUserId(
  userId: string,
  year?: number,
  month?: number
): Promise<RawAttendanceUserSummary> {
  try {
    let query = "";
    if (year && month) {
      query = `?year=${year}&month=${month}`;
    }
    const { data } = await axiosClient.get(`/attendance/summary/${userId}${query}`);
    return data.data;
  } catch (error) {
    throw handleError(error);
  }
}

const CLL_WIFI_IP = "103.112.189.131";

export const checkNetwork = async (): Promise<boolean> => {
  try {
    const res = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(5000) });
    const data = await res.json();
    return typeof data.ip === "string" && data.ip.startsWith(CLL_WIFI_IP);
  } catch {
    return false;
  }
};

export const postCheckIn = async (reason: string = ''): Promise<unknown> => {
  try {
    const res = await axiosClient.post('/attendance/checkin', { reason });
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const postCheckOut = async (): Promise<unknown> => {
  try {
    const res = await axiosClient.patch('/attendance/checkout');
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const postCheckOutByOperational = async (userId: string, reasonCheckOut: string): Promise<unknown> => {
  try {
    const res = await axiosClient.patch('/attendance/checkout-by-operational', {
      userId,
      reasonCheckOut,
    });
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface CheckoutAllResult {
  data?: { checkedOut?: number };
  [key: string]: unknown;
}

export const postCheckOutAllByOperational = async (reasonCheckOut: string): Promise<CheckoutAllResult> => {
  try {
    const res = await axiosClient.patch('/attendance/checkout-all-by-operational', { reasonCheckOut });
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface RawAttendanceRecord {
  _id?: string;
  userId: string;
  checkIn?: string;
  checkOut?: string;
  reason?: string;
  date?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export const getAttendance = async (year: number, month: number, day?: number): Promise<RawAttendanceRecord[]> => {
  try {
    const params: Record<string, number> = { year, month };
    if (day !== undefined) params.day = day;
    const res = await axiosClient.get('/attendance/', { params });
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getAttendanceToday = async (): Promise<RawAttendanceRecord[]> => {
  try {
    const today = wibNow();
    return await getAttendance(today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate());
  } catch (error) {
    throw handleError(error);
  }
};

export interface RawAttendanceMeSummary {
  statusSummary?: { status: string; count: number }[];
  [key: string]: unknown;
}

export const getAttendanceMe = async (): Promise<RawAttendanceMeSummary> => {
  try {
    const res = await axiosClient.get("/attendance/summary/me");
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMyStatusToday = async (): Promise<{ checkedIn: boolean; checkedOut: boolean }> => {
  try {
    const res = await axiosClient.get("/attendance/me/today");
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface MyLeaveRequestToday {
  type: string;
  status: string;
  reason?: string;
}

export const getMyLeaveRequestToday = async (): Promise<MyLeaveRequestToday | null> => {
  try {
    const res = await axiosClient.get("/attendance/leave-requests/me/today");
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface RawLeaveRequestItem {
  _id: string;
  userId: string;
  start_date?: string;
  startDate?: string;
  end_date?: string;
  endDate?: string;
  approval_status?: string;
  approvalStatus?: string;
  status?: string;
  type?: string;
  reason?: string;
  attachment_url?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export async function getAllLeaveRequests(year: number, month: number): Promise<RawLeaveRequestItem[]> {
  try {
    // Filtered server-side by the leave's start_date month, not submission date.
    const { data } = await axiosClient.get(`/attendance/leave-requests`, { params: { year, month } });
    return data.data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function getTodayLeaveRequests(): Promise<RawLeaveRequestItem[]> {
  try {
    // "Active on" today (WIB): submitted today, or a multi-day leave whose
    // range still covers today — computed server-side now.
    const { data } = await axiosClient.get("/attendance/leave-requests", { params: { activeOn: wibTodayDateString() } });
    return data.data;
  } catch (error) {
    throw handleError(error);
  }
}

export interface RawAttendanceSummaryItem {
  userId: string;
  userName?: string;
  counts?: {
    present?: number;
    permit?: number;
    sick?: number;
    late?: number;
    absent?: number;
    sp?: string | null;
  };
  [key: string]: unknown;
}

export async function getAttendanceSummary(year?: number, month?: number): Promise<RawAttendanceSummaryItem[]> {
  try {
    const query = year && month ? `?year=${year}&month=${month}` : "";
    const { data } = await axiosClient.get(`/attendance/summary${query}`);
    return data.data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function getLeaveRequestById(id: string): Promise<RawLeaveRequestItem> {
  try {
    const { data } = await axiosClient.get(`/attendance/leave-requests/${id}`);
    return data.data;
  } catch (error) {
    throw handleError(error);
  }
}

export const postCheckinByAdmin = async (userId: string): Promise<unknown> => {
  try {
    const res = await axiosClient.post('/attendance/checkin-by-admin', { userId });
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

export async function reviewLeaveRequest(id: string, status: string): Promise<void> {
  try {
    await axiosClient.patch(`/attendance/leave-requests/review/${id}`, {
      approvalStatus: status,
    });
  } catch (error) {
    throw handleError(error);
  }
}
