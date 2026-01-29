import { axiosClient } from "@/lib/axiosClient";

export const getPicketSchedules = async () => {
  const response = await axiosClient.get("/schedules?type=picket");
  return response.data;
};

export const getPicketRecords = async () => {
  const response = await axiosClient.get("/operational-records?type=picket");
  return response.data.data;
};

export const postPicketRecord = async (payload: any) => {
  const response = await axiosClient.post("/operational-records", payload);
  return response.data;
};

export const deletePicketRecord = async (recordId: string) => {
  await axiosClient.delete(`/operational-records/${recordId}`);
};
