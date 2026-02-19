import { axiosClient } from "@/lib/axiosClient";

export async function getAllUsers() {
    const {data} = await axiosClient.get("/users")
    return data.data
}


export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  [key: string]: unknown;
}

export const createUser = async (payload: UserPayload) => {
  const res = await axiosClient.post("/auth/register", payload);
  return res.data;
};

export async function getMe() {
  const { data } = await axiosClient.get("/auth/me");
  return data.data;
}

export async function getUserById(id: string) {
  const { data } = await axiosClient.get(`/users/${id}`);
  return data.data;
}

export async function updateUser(id: string, payload: UserPayload) {
  const { data } = await axiosClient.patch(`/users/${id}`, payload);
  return data;
}


export interface DeviceIdPayload {
  device_id: string | null;
}

export async function updateDeviceId(payload: DeviceIdPayload) {
  const { data } = await axiosClient.patch(`/users/me/update-device`, payload);
  return data;
}

