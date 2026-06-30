import { axiosClient } from "@/lib/axiosClient";

export interface TimeSetting {
  _id: string;
  code: string;
  checkin: string;
  checkinlimit: string;
  checkinlatelimit: string;
  checkout: string;
  checkoutlate: string;
}

export const getAllTimeSettings = async (): Promise<TimeSetting[]> => {
  const { data } = await axiosClient.get("/time-setting");
  return data.data ?? [];
};

export const updateTimeSetting = async (id: string, payload: Partial<Omit<TimeSetting, "_id" | "code">>): Promise<TimeSetting> => {
  const { data } = await axiosClient.patch(`/time-setting/${id}`, payload);
  return data.data;
};

export const getTimeSettingByCode = async (code: string): Promise<TimeSetting | null> => {
  try {
    const { data } = await axiosClient.get(`/time-setting/code/${code}`);
    return data.data ?? null;
  } catch {
    return null;
  }
};
