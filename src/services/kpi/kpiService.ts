import { axiosClient } from "@/lib/axiosClient";

export const getKPIAllOperational = async (year: number, month: number) => {
  const res = await axiosClient.get(`/kpi/operational?year=${year}&month=${month}`);
  return res.data.data;
};

export const getKPIAllResearch = async (year: number, month: number) => {
  const res = await axiosClient.get(`/kpi/research?year=${year}&month=${month}`);
  return res.data.data;
};