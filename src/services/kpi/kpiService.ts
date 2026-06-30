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

type KPISummaryDetail = { kpi_item: string; jumlah_activity: number; point_akhir: number };
type KPISummaryCategory = { kementerian: string; details: KPISummaryDetail[]; total_point: number };

const findCategory = (categories: KPISummaryCategory[], kementerian: string) =>
  categories.find((c) => c.kementerian.toLowerCase() === kementerian);

const findDetail = (category: KPISummaryCategory | undefined, kpiItem: string) =>
  category?.details.find((d) => d.kpi_item.toLowerCase() === kpiItem);

const toCountPoint = (detail?: KPISummaryDetail) => ({
  count: detail?.jumlah_activity ?? 0,
  totalPoints: detail?.point_akhir ?? 0,
});

export const getKPIMeDetail = async (id: string, year: number, month: number) => {
  const res = await axiosClient.get(`/kpi/summary/${id}?year=${year}&month=${month}`);
  const categories: KPISummaryCategory[] = res.data.data?.categories ?? [];

  const research = findCategory(categories, "research");
  const operational = findCategory(categories, "operational");
  const branding = findCategory(categories, "branding");
  const competition = findCategory(categories, "competition");

  const summary = {
    research: {
      personal: toCountPoint(findDetail(research, "personal")),
      product: toCountPoint(findDetail(research, "product")),
      workshop: toCountPoint(findDetail(research, "workshop")),
    },
    operational: {
      picket: toCountPoint(findDetail(operational, "picket")),
      thematic: toCountPoint(findDetail(operational, "thematic")),
    },
    attendance: {
      present: toCountPoint(findDetail(operational, "attendance")),
    },
    branding: {
      count: branding?.details.reduce((sum, d) => sum + d.jumlah_activity, 0) ?? 0,
      totalPoints: branding?.total_point ?? 0,
    },
    competition: {
      count: competition?.details.reduce((sum, d) => sum + d.jumlah_activity, 0) ?? 0,
      totalPoints: competition?.total_point ?? 0,
    },
  };

  return { summary };
};


export const getKPIItemsByKementerian = async (kementerian: string): Promise<string[]> => {
  const res = await axiosClient.get(`/kpi/master/${kementerian}/details`);
  const details: { kpi_item: string }[] = res.data.data?.details ?? [];
  return details.map((d) => d.kpi_item);
};

export const getKPIMaster = async () => {
  const res = await axiosClient.get(`/kpi/master`);
  return res.data.data;
};

export const updateKPIMaster = async (id: string, payload: { name: string; point: number }) => {
  const res = await axiosClient.put(`/kpi/master/${id}`, payload);
  return res.data.data;
};

export const getKPIDetail = async (masterId: string) => {
  const res = await axiosClient.get(`/kpi/detail/${masterId}`);
  return res.data.data;
};

export const createKPIDetail = async (payload: {
  kpi_item: string;
  point: number;
  max_activity: number;
  id_kpi_master: string;
  label: string;
}) => {
  const res = await axiosClient.post(`/kpi/detail`, payload);
  return res.data.data;
};

export const updateKPIDetail = async (id: string, payload: {
  kpi_item: string;
  point: number;
  max_activity: number;
  id_kpi_master: string;
  label: string;
}) => {
  const res = await axiosClient.put(`/kpi/detail/${id}`, payload);
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

