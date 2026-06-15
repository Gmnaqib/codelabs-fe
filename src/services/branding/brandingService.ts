type BrandingPayload = {
  // Define the expected fields for branding payload
  // Example:
  // name: string;
  // description?: string;
  // Add more fields as needed
  [key: string]: unknown;
};

export const addBranding = async (payload: BrandingPayload) => {
  const { data } = await axiosClient.post("/branding", payload);
  return data;
};
export const updateBranding = async (id: string, payload: BrandingPayload) => {
  const res = await axiosClient.patch(`/branding/${id}`, payload);
  return res.data.data;
};
import { axiosClient } from "@/lib/axiosClient";

export interface BrandingFilterParams {
  date?: string;
  week?: string | number;
  contentType?: string;
  search?: string;
}

export const getAllBranding = async (params?: BrandingFilterParams) => {
  const res = await axiosClient.get("/branding", { params });
  return res.data.data;
};

export const getMyBranding = async (year: number, month: number) => {
  const res = await axiosClient.get(`/branding/me?year=${year}&month=${month}`);
  return res.data.data;
};

export const getBrandingById = async (id: string) => {
  const res = await axiosClient.get(`/branding/${id}`);
  return res.data.data;
};

export const updateBrandingStatus = async (id: string, status: number) => {
  const res = await axiosClient.patch(`/branding/${id}`, { status });
  return res.data.data;
};