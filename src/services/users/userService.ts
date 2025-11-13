import { axiosClient } from "@/lib/axiosClient";

export async function getAllUsers() {
    const {data} = await axiosClient.get("/users")
    return data.data
}

export const createUser = async (payload: any) => {
  const res = await axiosClient.post("/auth/register", payload);
  return res.data;
};
