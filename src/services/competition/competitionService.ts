import { axiosClient } from "@/lib/axiosClient";

export const getAllCompetition = async () => {
  const res = await axiosClient.get("/competition");
  return res.data.data;
};