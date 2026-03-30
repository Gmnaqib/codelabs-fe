import { axiosClient } from "@/lib/axiosClient";
import { saveToken } from "@/lib/token";
import { LoginResponse } from "@/types/user";
import { AxiosError } from "axios";

interface LoginPayload {
  nim: string;
  password: string;
  device_id?: string;
}

interface ErrorResponse {
  message: string;
}

function getDeviceId(): string {
  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("device_id", deviceId);
  }

  return deviceId;
}

export async function loginUser(
  nim: string,
  password: string
): Promise<LoginResponse> {

  const existingDeviceId = localStorage.getItem("device_id");

  const payload: LoginPayload = {
    nim,
    password,
    ...(existingDeviceId ? { device_id: existingDeviceId } : {}),
  };

  try {
    const { data } = await axiosClient.post<LoginResponse>(
      "/auth/login",
      payload
    );

    if (data?.data?.token) {
      saveToken(data.data.token);
    }

    return data;

  } catch (err) {

    const error = err as AxiosError<ErrorResponse>;

    if (error.response?.data?.message === "Device ID is required") {

      const newDeviceId = getDeviceId();

      const retryPayload: LoginPayload = {
        nim,
        password,
        device_id: newDeviceId,
      };

      const { data } = await axiosClient.post<LoginResponse>(
        "/auth/login",
        retryPayload
      );

      if (data?.data?.token) {
        saveToken(data.data.token);
      }

      return data;
    }

    throw err;
  }
}