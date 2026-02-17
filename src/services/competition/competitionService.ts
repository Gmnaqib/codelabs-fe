export interface CompetitionPayload {
  name: string;
  description?: string;
  date?: string | Date;
  location?: string;
  status?: string;
  [key: string]: unknown;
}

export const addCompetition = async (payload: CompetitionPayload) => {
  const { data } = await axiosClient.post("/competition", payload);
  return data;
};
export const updateCompetition = async (id: string, payload: CompetitionPayload) => {
  const res = await axiosClient.patch(`/competition/${id}`, payload);
  return res.data.data;
};
import { axiosClient } from "@/lib/axiosClient";

export interface CompetitionFilterParams {
  date?: string; // format: YYYY-MM
}

export const getAllCompetition = async (params?: CompetitionFilterParams) => {
  const res = await axiosClient.get("/competition", { params });
  return res.data.data;
};

export const getMeCompetition = async () => {
  const res = await axiosClient.get("/competition/me");
  return res.data.data;
};

export const getCompetitionById = async (id: string) => {
  const res = await axiosClient.get(`/competition/${id}`);
  return res.data.data;
};

export const updateCompetitionStatus = async (id: string, status: string) => {
  const res = await axiosClient.patch(`/competition/${id}`, {
    status: status.toLowerCase(),
  });
  return res.data.data;
};