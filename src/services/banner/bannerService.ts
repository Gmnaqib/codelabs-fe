import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";

export interface RawBanner {
  _id: string;
  name: string;
  point_cost: number;
  image: string;
}

export interface OwnedBanner extends RawBanner {
  active: boolean;
}

export interface MyBanners {
  activeBannerId: string | null;
  owned: OwnedBanner[];
}

export const getAllBanners = async (): Promise<RawBanner[]> => {
  try {
    const res = await axiosClient.get("/banners");
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMyBanners = async (): Promise<MyBanners> => {
  try {
    const res = await axiosClient.get("/banners/me");
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createBanner = async (formData: FormData): Promise<RawBanner> => {
  try {
    const res = await axiosClient.post("/banners", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateBanner = async (id: string, formData: FormData): Promise<RawBanner> => {
  try {
    const res = await axiosClient.put(`/banners/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteBanner = async (id: string): Promise<unknown> => {
  try {
    const res = await axiosClient.delete(`/banners/${id}`);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const buyBanner = async (id: string): Promise<unknown> => {
  try {
    const res = await axiosClient.post(`/banners/${id}/buy`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const equipBanner = async (id: string): Promise<unknown> => {
  try {
    const res = await axiosClient.post(`/banners/${id}/equip`);
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const unequipBanner = async (): Promise<unknown> => {
  try {
    const res = await axiosClient.post("/banners/unequip");
    return res.data.data;
  } catch (error) {
    throw handleError(error);
  }
};
