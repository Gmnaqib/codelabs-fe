import { axiosClient } from "@/lib/axiosClient";

export const getAttendance = async (year: number, month: number) => {
  const res = await axiosClient.get(`/attendance/?year=${year}&month=${month}`);
  return res.data.data;
};

export async function getAllLeaveRequests() {
  try {
    const { data } = await axiosClient.get("/attendance/leave-requests/");
    return data.data;
  } catch (error) {
    console.error("Error fetching all leave requests:", error);
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