import { axiosClient } from "@/lib/axiosClient";

export const getAllResearchRecords = async (year: number, month: number) => {
  const res = await axiosClient.get(`/research?year=${year}&month=${month}`);
  return res.data.data;
};

export const getResearchById = async (id: string) => {
  const res = await axiosClient.get(`/research/${id}`);
  return res.data.data;
};

export const getMeResearchRecords = async () => {
  const res = await axiosClient.get("/research/me");
  return res.data.data;
};

export interface ResearchRecordPayload {
  title: string;
  description?: string;
  date?: string | Date;
  status?: string;
  [key: string]: unknown;
}

export const createResearchRecord = async (payload: ResearchRecordPayload) => {
  const res = await axiosClient.post("/research", payload);
  return res.data;
};

export async function updateResearchRecord(id: string, payload: ResearchRecordPayload) {
  const { data } = await axiosClient.patch(`/research/me/${id}`, payload)
  return data
}

export const updateResearchStatus = async (id: string, status: string) => {
  const res = await axiosClient.patch(`/research/${id}`, {
    status: status.toLowerCase(),
  });
  return res.data.data;
};