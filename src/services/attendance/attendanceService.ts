// Fungsi untuk melakukan check-in

import { axiosClient } from "@/lib/axiosClient";

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

export async function getAllLeaveRequests(year: number, month: number) {
  const { data } = await axiosClient.get(`/attendance/leave-requests`);
  const list = data.data;

  const filtered = list.filter((item: any) => {
    const d = new Date(item.startDate);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  return filtered;
}

export async function getTodayLeaveRequests() {
  try {
    const { data } = await axiosClient.get("/attendance/leave-requests");
    const list = data.data;
    const today = new Date();
    // Only match year, month, date
    const filtered = list.filter((item: any) => {
      const d = new Date(item.start_date || item.startDate);
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
    const res = await axiosClient.patch(`/attendance/leave-requests/review/${id}`, {
      approvalStatus: status,
    });
  }catch (error) {
    console.error("Error fetching leave request by id:", error);
    throw error;
  }
    
}
