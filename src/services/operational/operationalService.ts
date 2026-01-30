import { axiosClient } from "@/lib/axiosClient";

export interface OperationalRecordPayload {
  userId: string;
  type: string;
  date: string;
}

export const createOperationalRecord = async (payload: OperationalRecordPayload) => {
  try {
    const res = await axiosClient.post("/operational-records", payload);
    return res.data;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: { data?: unknown }; message?: unknown }).response === "object"
    ) {
      const errObj = error as { response?: { data?: unknown }; message?: unknown };
      console.error(
        "❌ Gagal membuat operational record:",
        errObj.response?.data || errObj.message
      );
    } else {
      console.error("❌ Gagal membuat operational record:", error);
    }
    throw error;
  }
};

export const getOperationalRecords = async (
  type?: string,
  userId?: string,
  year?: number,
  month?: number
) => {
  try {
    const params: Record<string, string> = {};

    if (type) params.type = type;
    if (userId) params.userId = userId;


    if (year) params.year = year.toString();
    if (month) params.month = month.toString().padStart(2, "0");

    const res = await axiosClient.get("/operational-records", { params });
    return res.data?.data || [];
  } catch (error) {
    console.error("❌ Error fetching operational records:", error);
    return [];
  }
};

export const deleteOperationalRecord = async (id: string) => {
  const res = await axiosClient.delete(`/operational-records/${id}`);
  return res.data;
};
