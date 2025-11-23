import { axiosClient } from "@/lib/axiosClient";

export const getMeResearchRecords = async () => {
  const res = await axiosClient.get("/research/me");
  return res.data.data;
};

export const getAllResearchRecords = async () => {
  const res = await axiosClient.get("/research");
  return res.data.data;
};

export const createResearchRecord = async (payload: any) => {
  const res = await axiosClient.post("/research", payload);
  return res.data;
};

export const getResearchById = async (id: string) => {
  const res = await axiosClient.get(`/research/${id}`);
  return res.data.data;
};

export async function updateResearchRecord(id: string, payload: any) {
  const { data } = await axiosClient.patch(`/research/${id}`, payload)
  return data
}
