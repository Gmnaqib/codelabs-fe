import { axiosClient } from "@/lib/axiosClient";

export const getAllCompetition = async () => {
  const res = await axiosClient.get("/competition");
  return res.data.data;
};

export const getCompetitionById = async (id: string) => {
  const res = await axiosClient.get(`/competition/${id}`);
  return res.data.data;
};

export const updateCompetitionStatus = async (id: string, status: string) => {
  const res = await axiosClient.patch(`/competition/${id}`, {
    status: status.toLowerCase(),
  });
  return res.data.data;
};