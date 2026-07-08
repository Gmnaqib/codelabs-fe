import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";

export interface RawKPIOperationalDetail {
  count: number;
  code: string;
  point: number;
  total: number;
}

export interface RawKPIAllOperationalItem {
  userId: string;
  userName: string;
  totalPoints: number;
  operationalDetail: {
    attendance: RawKPIOperationalDetail;
    picket: RawKPIOperationalDetail;
    thematic: RawKPIOperationalDetail;
  };
  year?: number;
  month?: number;
  [key: string]: unknown;
}

export const getKPIAllOperational = async (
  year: number,
  month: number
): Promise<RawKPIAllOperationalItem[]> => {
  try {
    const res = await axiosClient.get(`/kpi/operational?year=${year}&month=${month}`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface RawKPIStatisticItem {
  totalResearch?: number;
  totalAttendance?: number;
  [key: string]: unknown;
}

export interface RawKPIStatisticResponse {
  data?: RawKPIStatisticItem[];
  [key: string]: unknown;
}

export const getKPIStatistic = async (year: number): Promise<RawKPIStatisticResponse> => {
  try {
    const res = await axiosClient.get(`/kpi/statistic?year=${year}`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface RawKPIResearchItem {
  userId: string;
  userName: string;
  totalPoints: number;
  byCategory: {
    personal: { count: number; total: number };
    product: { count: number; total: number };
    workshop: { count: number; total: number };
  };
  year?: number;
  month?: number;
  [key: string]: unknown;
}

export interface RawKPIAllResearchResponse {
  byUser?: RawKPIResearchItem[];
  data?: { byUser?: RawKPIResearchItem[] };
  [key: string]: unknown;
}

export const getKPIAllResearch = async (
  year: number,
  month: number
): Promise<RawKPIResearchItem[] | RawKPIAllResearchResponse> => {
  try {
    const res = await axiosClient.get(`/kpi/research?year=${year}&month=${month}`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface RawResearchSummary {
  totalApproved?: number;
  totalPoint?: number;
  [key: string]: unknown;
}

export const getKPIMeResearch = async (year: number, month: number): Promise<RawResearchSummary> => {
  try {
    const res = await axiosClient.get(`/kpi/research/me?year=${year}&month=${month}`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface RawOperationalSummary {
  totalAttendance?: number;
  totalTematik?: number;
  totalPicket?: number;
  totalPoint?: number;
  [key: string]: unknown;
}

export const getKPIMeOperational = async (year: number, month: number): Promise<RawOperationalSummary> => {
  try {
    const res = await axiosClient.get(`/kpi/operational/me?year=${year}&month=${month}`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface RawKPIMeRanking {
  totalPoints: number;
  // NOTE: some legacy callers (src/app/scoring/page.tsx) read `totalPoint` (singular),
  // a pre-existing mismatch with the real `totalPoints` field. Kept as an explicit
  // optional field (not fixed) to preserve current behavior without any type errors.
  totalPoint?: number;
  rank?: number;
  [key: string]: unknown;
}

export const getKPIMeRankings = async (year: number, month: number): Promise<RawKPIMeRanking> => {
  try {
    const res = await axiosClient.get(`/kpi/me?year=${year}&month=${month}`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
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

export interface KPIMeDetailSummary {
  research: {
    personal: { count: number; totalPoints: number };
    product: { count: number; totalPoints: number };
    workshop: { count: number; totalPoints: number };
  };
  operational: {
    picket: { count: number; totalPoints: number };
    thematic: { count: number; totalPoints: number };
  };
  attendance: {
    present: { count: number; totalPoints: number };
  };
  branding: { count: number; totalPoints: number };
  competition: { count: number; totalPoints: number };
}

export const getKPIMeDetail = async (
  id: string,
  year: number,
  month: number
): Promise<{ summary: KPIMeDetailSummary }> => {
  try {
    const res = await axiosClient.get(`/kpi/summary/${id}?year=${year}&month=${month}`);
    const categories: KPISummaryCategory[] = res.data.data?.categories ?? [];

    const research = findCategory(categories, "research");
    const operational = findCategory(categories, "operational");
    const branding = findCategory(categories, "branding");
    const competition = findCategory(categories, "competition");

    const summary: KPIMeDetailSummary = {
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
  } catch (error) {
    throw handleError(error);
  }
};

export const getKPIItemsByKementerian = async (kementerian: string): Promise<string[]> => {
  try {
    const res = await axiosClient.get(`/kpi/master/${kementerian}/details`);
    const details: { kpi_item: string }[] = res.data.data?.details ?? [];
    return details.map((d) => d.kpi_item);
  } catch (error) {
    throw handleError(error);
  }
};

export interface RawKPIMasterItem {
  _id: string;
  kementerian: string;
  point: number;
  utilized?: number;
  [key: string]: unknown;
}

export const getKPIMaster = async (): Promise<RawKPIMasterItem[]> => {
  try {
    const res = await axiosClient.get(`/kpi/master`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateKPIMaster = async (
  id: string,
  payload: { name: string; point: number }
): Promise<RawKPIMasterItem> => {
  try {
    const res = await axiosClient.put(`/kpi/master/${id}`, payload);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface RawKPIDetailItem {
  _id: string;
  kpi_item: string;
  point: number;
  label: string;
  max_activity: number;
  [key: string]: unknown;
}

export const getKPIDetail = async (masterId: string): Promise<RawKPIDetailItem[]> => {
  try {
    const res = await axiosClient.get(`/kpi/detail/${masterId}`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createKPIDetail = async (payload: {
  kpi_item: string;
  point: number;
  max_activity: number;
  id_kpi_master: string;
  label: string;
}): Promise<RawKPIDetailItem> => {
  try {
    const res = await axiosClient.post(`/kpi/detail`, payload);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateKPIDetail = async (
  id: string,
  payload: {
    kpi_item: string;
    point: number;
    max_activity: number;
    id_kpi_master: string;
    label: string;
  }
): Promise<RawKPIDetailItem> => {
  try {
    const res = await axiosClient.put(`/kpi/detail/${id}`, payload);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface RawKPIRankingItem {
  userId: string;
  name: string;
  totalPoints: number;
  year?: number;
  month?: number;
  image?: string | null;
  monthly?: number | string;
  [key: string]: unknown;
}

export const getKPIRankings = async (year: number, month: number): Promise<RawKPIRankingItem[]> => {
  try {
    const res = await axiosClient.get(`/kpi?year=${year}&month=${month}`);
    const data = res.data.data as RawKPIRankingItem[];
    // Kapitalisasi nama
    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item && typeof item.name === 'string' && item.name.length > 0) {
          item.name = item.name.charAt(0).toUpperCase() + item.name.slice(1);
        }
      });
    }
    return data;
  } catch (error) {
    throw handleError(error);
  }
};
