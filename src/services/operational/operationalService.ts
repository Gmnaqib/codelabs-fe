import { axiosClient } from "@/lib/axiosClient";

export const createOperationalRecord = async (userId: string, type: string, date: string) => {
  try {
    const res = await axiosClient.post("/operational-records", {
      userId,
      type,
      date,
    });
    return res.data;
  } catch (error: any) {
    console.error("❌ Gagal membuat operational record:", error.response?.data || error.message);
    throw error;
  }
};

export const getOperationalRecords = async (type?: string, userId?: string) => {
  try {
    const params: Record<string, string> = {};
    if (type) params.type = type;
    if (userId) params.userId = userId;

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
