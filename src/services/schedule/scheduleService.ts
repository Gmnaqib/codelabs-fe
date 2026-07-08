import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";
import type { OperationalRecordPayload, CreateOperationalRecordResponse } from "@/services/operational/operationalService";
import type { OperationalRecord } from "@/types/domain";

export const getPicketSchedules = async (): Promise<unknown> => {
  try {
    const response = await axiosClient.get("/schedules?type=picket");
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getPicketRecords = async (): Promise<OperationalRecord[]> => {
  try {
    const response = await axiosClient.get("/operational-records?type=picket");
    return response.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const postPicketRecord = async (
  payload: OperationalRecordPayload
): Promise<CreateOperationalRecordResponse> => {
  try {
    const response = await axiosClient.post("/operational-records", payload);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deletePicketRecord = async (recordId: string): Promise<void> => {
  try {
    await axiosClient.delete(`/operational-records/${recordId}`);
  } catch (error) {
    throw handleError(error);
  }
};
