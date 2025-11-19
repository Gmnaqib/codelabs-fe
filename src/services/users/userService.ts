import { axiosClient } from "@/lib/axiosClient";

export async function getAllUsers() {
    const {data} = await axiosClient.get("/users")
    return data.data
}

export const createUser = async (payload: any) => {
  const res = await axiosClient.post("/auth/register", payload);
  return res.data;
};

export async function getMe() {
  const { data } = await axiosClient.get("/auth/me");
  return data.data;
}

export async function updateUser(id: string, payload: any) {
  const { data } = await axiosClient.patch(`/users/${id}`, payload);
  return data;
}