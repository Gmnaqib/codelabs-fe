import { axiosClient } from "@/lib/axiosClient";
import type { OperationalRecordPayload } from "@/services/operational/operationalService";

export const getPicketSchedules = async () => {
  const response = await axiosClient.get("/schedules?type=picket");
  return response.data;
};

export const getPicketRecords = async () => {
  const response = await axiosClient.get("/operational-records?type=picket");
  return response.data.data;
};

export const postPicketRecord = async (payload: OperationalRecordPayload) => {
  const response = await axiosClient.post("/operational-records", payload);
  return response.data;
};

export const deletePicketRecord = async (recordId: string) => {
  await axiosClient.delete(`/operational-records/${recordId}`);
};
