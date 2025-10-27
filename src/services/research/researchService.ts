import { axiosClient } from "@/lib/axiosClient";

export const getAllResearchRecords = async () => {
  const res = await axiosClient.get("/research/my");
  return res.data.data; // sesuai struktur respons kamu
};

export const createResearchRecord = async (payload: any) => {
  const res = await axiosClient.post("/research", payload);
  return res.data;
};