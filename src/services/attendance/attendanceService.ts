import { axiosClient } from "@/lib/axiosClient";

export const getAttendance = async (year: number, month: number) => {
  const res = await axiosClient.get(`/attendance/?year=${year}&month=${month}`);
  return res.data.data;
};

export async function getAllLeaveRequests(year?: number, month?: number) {
  try {
    const params = new URLSearchParams();

    if (year) params.append("year", String(year));
    if (month) params.append("month", String(month));

    const queryString = params.toString() ? `?${params.toString()}` : "";

    const { data } = await axiosClient.get(
      `/attendance/leave-requests/${queryString}`
    );

    return data.data;
  } catch (error) {
    console.error("❌ Error fetching all leave requests:", error);
    throw error;
  }
}

export async function getTodayLeaveRequests() {
  try {
    const { data } = await axiosClient.get("/attendance/leave-requests/today");
    return data.data; 
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    throw error;
  }
}