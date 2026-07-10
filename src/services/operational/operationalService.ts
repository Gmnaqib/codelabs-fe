import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";
import type { OperationalRecord } from "@/types/domain";

export interface OperationalRecordPayload {
  userId: string;
  type: string;
  date: string;
}

export interface CreateOperationalRecordResponse {
  code: number;
  status: string;
  message: string;
  data: OperationalRecord;
}

export const createOperationalRecord = async (
  payload: OperationalRecordPayload
): Promise<CreateOperationalRecordResponse> => {
  try {
    const res = await axiosClient.post("/operational-records", payload);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getOperationalRecords = async (
  type?: string,
  userId?: string,
  year?: number,
  month?: number
): Promise<OperationalRecord[]> => {
  try {
    const params: Record<string, string> = {};

    if (type) params.type = type;
    if (userId) params.userId = userId;


    if (year) params.year = year.toString();
    if (month) params.month = month.toString().padStart(2, "0");

    const res = await axiosClient.get("/operational-records", { params });
    return res.data?.data || [];
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteOperationalRecord = async (id: string): Promise<unknown> => {
  try {
    const res = await axiosClient.delete(`/operational-records/${id}`);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getSchedulesPicket = async (): Promise<unknown> => {
  try {
    const res = await axiosClient.get(`/schedules?type=picket`);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface RawProductRecord {
  _id: string;
  name: string;
  description: string;
  status: string;
  [key: string]: unknown;
}

export const getProducts = async (): Promise<RawProductRecord[]> => {
  try {
    const res = await axiosClient.get('/products/');
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};
