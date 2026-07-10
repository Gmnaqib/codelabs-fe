import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";

type BrandingPayload = {
  // Define the expected fields for branding payload
  // Example:
  // name: string;
  // description?: string;
  // Add more fields as needed
  [key: string]: unknown;
};

export interface RawBrandingRecord {
  _id: string;
  name?: string;
  description?: string;
  link?: string;
  research?: string;
  level?: string;
  status?: number | string;
  createdAt?: string;
  week?: number | string;
  [key: string]: unknown;
}

export const addBranding = async (payload: BrandingPayload): Promise<unknown> => {
  try {
    const { data } = await axiosClient.post("/branding", payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateBranding = async (id: string, payload: BrandingPayload): Promise<RawBrandingRecord> => {
  try {
    const res = await axiosClient.patch(`/branding/${id}`, payload);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export interface BrandingFilterParams {
  date?: string;
  week?: string | number;
  contentType?: string;
  search?: string;
}

export const getAllBranding = async (params?: BrandingFilterParams): Promise<RawBrandingRecord[]> => {
  try {
    const res = await axiosClient.get("/branding", { params });
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMyBranding = async (year?: number, month?: number): Promise<RawBrandingRecord[]> => {
  try {
    const params: Record<string, number> = {};
    if (year !== undefined) params.year = year;
    if (month !== undefined) params.month = month;
    const res = await axiosClient.get(`/branding/me`, { params });
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getBrandingById = async (id: string): Promise<RawBrandingRecord> => {
  try {
    const res = await axiosClient.get(`/branding/${id}`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateBrandingStatus = async (id: string, status: number): Promise<RawBrandingRecord> => {
  try {
    const res = await axiosClient.patch(`/branding/${id}`, { status });
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};
