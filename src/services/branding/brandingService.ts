// Update all branding fields
export const updateBranding = async (id: string, payload: any) => {
  const res = await axiosClient.patch(`/branding/${id}`, payload);
  return res.data.data;
};
import { axiosClient } from "@/lib/axiosClient";

export const getAllBranding = async () => {
  const res = await axiosClient.get("/branding");
  return res.data.data;
};

export const getMyBranding = async () => {
  const res = await axiosClient.get("/branding/me");
  return res.data.data;
};

export const getBrandingById = async (id: string) => {
  const res = await axiosClient.get(`/branding/${id}`);
  return res.data.data;
};

export const updateBrandingStatus = async (id: string, status: string) => {
  const res = await axiosClient.patch(`/branding/${id}`, {
    status: status.toLowerCase(),
  });
  return res.data.data;
};