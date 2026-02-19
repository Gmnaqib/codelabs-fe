
import { axiosClient } from "@/lib/axiosClient";

export async function postLeaveRequest({ type, reason, attachment, start_date, end_date }: {
  type: 'sick' | 'permit';
  reason: string;
  attachment: File | Blob;
  start_date: string;
  end_date: string;
}) {
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
    console.error('Error posting leave request:', error);
    throw error;
  }
}

export async function getAttendanceSummaryByUserId(userId: string, year?: number, month?: number) {
  try {
    let query = "";
    if (year && month) {
      query = `?year=${year}&month=${month}`;
    }
    const { data } = await axiosClient.get(`/attendance/summary/${userId}${query}`);
    return data.data;
  } catch (error) {
    console.error("Error fetching attendance summary by userId:", error);
    throw error;
  }
}

export const postCheckIn = async (device_id: string, reason: string = '') => {
  const res = await axiosClient.post('/attendance/checkin', {
    reason,
    device_id,
  });
  return res.data;
};

export const getAttendance = async (year: number, month: number) => {
  const res = await axiosClient.get(`/attendance/?year=${year}&month=${month}`);
  return res.data.data;
};

export const getAttendanceMe = async () => {
  const res = await axiosClient.get("/attendance/summary/me");
  return res.data.data;
};

export async function getAllLeaveRequests(year: number, month: number) {
  type LeaveRequest = { start_date?: string; startDate?: string };
  const { data } = await axiosClient.get(`/attendance/leave-requests`);
  const list: LeaveRequest[] = data.data;

  const filtered = list.filter((item: LeaveRequest) => {
    const d = new Date(item.start_date || item.startDate || "");
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  return filtered;
}

export async function getTodayLeaveRequests() {
  try {
    const { data } = await axiosClient.get("/attendance/leave-requests");
    const list = data.data;
    const today = new Date();
    type LeaveRequest = { start_date?: string; startDate?: string };
    const filtered = (list as LeaveRequest[]).filter((item) => {
      const d = new Date(item.start_date || item.startDate || "");
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    });
    return filtered;
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    throw error;
  }
}

export async function getAttendanceSummary(year?: number, month?: number) {
  const query = year && month ? `?year=${year}&month=${month}` : "";
  const { data } = await axiosClient.get(`/attendance/summary${query}`);
  return data.data;
}

export async function getLeaveRequestById(id: string) {
  try {
    const { data } = await axiosClient.get(`/attendance/leave-requests/${id}`);
    return data.data;
  } catch (error) {
    console.error("Error fetching leave request by id:", error);
    throw error;
  }
}

export async function reviewLeaveRequest(id: string, status: string) {
  try {
    await axiosClient.patch(`/attendance/leave-requests/review/${id}`, {
      approvalStatus: status,
    });
  } catch (error) {
    console.error("Error fetching leave request by id:", error);
    throw error;
  }
}

