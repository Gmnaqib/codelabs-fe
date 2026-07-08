import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";

export interface CompetitionPayload {
  name: string;
  description?: string;
  date?: string | Date;
  location?: string;
  status?: string;
  [key: string]: unknown;
}

export interface RawCompetitionRecord {
  _id: string;
  name?: string;
  description?: string;
  deadline?: string;
  link?: string;
  type?: string;
  category?: string;
  status?: string;
  [key: string]: unknown;
}

export const addCompetition = async (payload: CompetitionPayload): Promise<unknown> => {
  try {
    const { data } = await axiosClient.post("/competition", payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateCompetition = async (
  id: string,
  payload: CompetitionPayload
): Promise<RawCompetitionRecord> => {
  try {
    const res = await axiosClient.patch(`/competition/${id}`, payload);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface CompetitionFilterParams {
  date?: string;
}

export const getAllCompetition = async (
  params?: CompetitionFilterParams
): Promise<RawCompetitionRecord[]> => {
  try {
    const res = await axiosClient.get("/competition", { params });
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMeCompetition = async (year: number, month: number): Promise<RawCompetitionRecord[]> => {
  try {
    const res = await axiosClient.get(`/competition/me?year=${year}&month=${month}`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getCompetitionById = async (id: string): Promise<RawCompetitionRecord> => {
  try {
    const res = await axiosClient.get(`/competition/${id}`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateCompetitionStatus = async (id: string, status: string): Promise<RawCompetitionRecord> => {
  try {
    const res = await axiosClient.patch(`/competition/${id}`, {
      status: status.toLowerCase(),
    });
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};
