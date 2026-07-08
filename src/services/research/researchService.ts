import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";

export interface RawResearchRecord {
  _id: string;
  title?: string;
  week?: number | string;
  progress?: string;
  status?: string;
  link?: string;
  challenge?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export const getAllResearchRecords = async (
  year: number,
  month: number
): Promise<RawResearchRecord[]> => {
  try {
    const res = await axiosClient.get(`/research?year=${year}&month=${month}`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getResearchById = async (id: string): Promise<RawResearchRecord> => {
  try {
    const res = await axiosClient.get(`/research/${id}`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMeResearchRecords = async (): Promise<
  RawResearchRecord[] | { data?: RawResearchRecord[] }
> => {
  try {
    const res = await axiosClient.get("/research/me");
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface ResearchRecordPayload {
  title: string;
  description?: string;
  date?: string | Date;
  status?: string;
  [key: string]: unknown;
}

export const createResearchRecord = async (payload: ResearchRecordPayload): Promise<unknown> => {
  try {
    const res = await axiosClient.post("/research", payload);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

export async function updateResearchRecord(
  id: string,
  payload: ResearchRecordPayload
): Promise<unknown> {
  try {
    const { data } = await axiosClient.patch(`/research/me/${id}`, payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export const updateResearchStatus = async (id: string, status: string): Promise<RawResearchRecord> => {
  try {
    const res = await axiosClient.patch(`/research/${id}`, {
      status: status.toLowerCase(),
    });
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};
