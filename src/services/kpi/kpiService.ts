import { axiosClient } from "@/lib/axiosClient";

export const getKPIAllOperational = async (year: number, month: number) => {
  const res = await axiosClient.get(`/kpi/operational?year=${year}&month=${month}`);
  return res.data.data;
};

export const getKPIStatistic = async (year: number) => {
  const res = await axiosClient.get(`/kpi/statistic?year=${year}`);
    return res.data.data;
  };

export const getKPIAllResearch = async (year: number, month: number) => {
  const res = await axiosClient.get(`/kpi/research?year=${year}&month=${month}`);
  return res.data.data;
};

export const getKPIMeResearch = async (year: number, month: number) => {
  const res = await axiosClient.get(`/kpi/research/me?year=${year}&month=${month}`);
  return res.data.data;
};

export const getKPIMeOperational = async (year: number, month: number) => {
  const res = await axiosClient.get(`/kpi/operational/me?year=${year}&month=${month}`);
  return res.data.data;
};


export const getKPIMeRankings = async (year: number, month: number) => {
  const res = await axiosClient.get(`/kpi/me?year=${year}&month=${month}`);
  return res.data.data;
};

export const getKPIRankings = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const res = await axiosClient.get(`/kpi?year=${year}&month=${month}`);
  return res.data.data;
};

