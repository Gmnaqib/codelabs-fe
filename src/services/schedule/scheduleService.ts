// src/services/schedules/scheduleService.ts
import { axiosClient } from "@/lib/axiosClient";

export const getPicketSchedules = async () => {
  try {
    const response = await axiosClient.get("/schedules?type=picket");
    return response.data;
  } catch (error) {
    console.error("Error fetching picket schedules:", error);
    throw error;
  }
};
