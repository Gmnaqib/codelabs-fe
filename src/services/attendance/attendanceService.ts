import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";
import { toWIB, wibDayOf, wibNow, truncateToWIBDay } from "@/shared/utils";

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

export const getAttendance = async (year: number, month: number): Promise<RawAttendanceRecord[]> => {
  try {
    const res = await axiosClient.get(`/attendance/?year=${year}&month=${month}`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getAttendanceToday = async (): Promise<RawAttendanceRecord[]> => {
  try {
    const today = wibNow();
    const year = today.getUTCFullYear();
    const month = today.getUTCMonth() + 1;
    const day = today.getUTCDate();
    const records = await getAttendance(year, month);
    return records.filter((record) => {
      const raw = record.date ?? record.checkIn ?? record.createdAt;
      if (typeof raw !== 'string') return false;
      const d = toWIB(new Date(raw));
      return (
        d.getUTCFullYear() === year &&
        d.getUTCMonth() + 1 === month &&
        d.getUTCDate() === day
      );
    });
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
    const { data } = await axiosClient.get(`/attendance/leave-requests`);
    const list: RawLeaveRequestItem[] = data.data;

    const filtered = list.filter((item) => {
      const d = new Date(item.start_date || item.startDate || "");
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });

    return filtered;
  } catch (error) {
    throw handleError(error);
  }
}

export async function getTodayLeaveRequests(): Promise<RawLeaveRequestItem[]> {
  try {
    const { data } = await axiosClient.get("/attendance/leave-requests");
    const list: RawLeaveRequestItem[] = data.data;
    const todayStart = truncateToWIBDay(wibNow());

    const filtered = list.filter((item) => {
      // Submitted today, regardless of when the leave itself is scheduled for.
      if (item.createdAt && wibDayOf(new Date(item.createdAt)) === todayStart) {
        return true;
      }

      // Or the leave's date range is active today (covers the start day,
      // the end day, and every day in between for multi-day leave).
      const startRaw = item.start_date || item.startDate;
      if (!startRaw) return false;
      const endRaw = item.end_date || item.endDate || startRaw;

      const start = wibDayOf(new Date(startRaw));
      const end = wibDayOf(new Date(endRaw));
      return todayStart >= start && todayStart <= end;
    });

    return filtered;
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
