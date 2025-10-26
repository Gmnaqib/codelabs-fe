import { axiosClient } from "@/lib/axiosClient";

export const getAttendance = async (year: number, month: number) => {
  const res = await axiosClient.get(`/attendance/?year=${year}&month=${month}`);
  return res.data.data;
};

export const getUsers = async () => {
  const res = await axiosClient.get("/users");
  return res.data.data;
};