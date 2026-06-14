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

export const getKPIMeDetail = async (id: string, year: number, month: number) => {
  const res = await axiosClient.get(`/kpi/summary/${id}?year=${year}&month=${month}`);
  return res.data.data;
};


export const getKPIMaster = async () => {
  const res = await axiosClient.get(`/kpi/master`);
  return res.data.data;
};

export const getKPIRankings = async (year: number, month: number) => {
  const res = await axiosClient.get(`/kpi?year=${year}&month=${month}`);
  const data = res.data.data;
  // Kapitalisasi nama
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item && typeof item.name === 'string' && item.name.length > 0) {
        item.name = item.name.charAt(0).toUpperCase() + item.name.slice(1);
      }
    });
  }
  return data;
};

