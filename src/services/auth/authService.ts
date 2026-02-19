import { axiosClient } from "@/lib/axiosClient";
import { saveToken } from "@/lib/token";
import { LoginResponse } from "@/types/user";

function getDeviceId(): string {
  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId = crypto.randomUUID(); 
    localStorage.setItem("device_id", deviceId);
  }

  return deviceId;
}


export async function loginUser(nim: string, password: string): Promise<LoginResponse> {
  const device_id = getDeviceId();

  const { data } = await axiosClient.post("/auth/login", {
    nim,
    password,
    device_id,
  });

  if (data?.data?.token) {
    saveToken(data.data.token);
  }

  return data;
}