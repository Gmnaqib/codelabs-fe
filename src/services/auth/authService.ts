import { axiosClient } from "@/lib/axiosClient";
import { AppError } from "@/shared/services";
import { API_ENDPOINTS } from "@/shared/constants";
import { getDeviceId, setStoredToken } from "@/shared/utils";
import { useAuthStore } from "@/shared/state";
import type { LoginPayload, LoginResponseData } from "@/types/domain";
import type { ApiResponse } from "@/types";

export async function loginUser(
  nim: string,
  password: string
): Promise<ApiResponse<LoginResponseData>> {

  const existingDeviceId = localStorage.getItem("device_id");

  const payload: LoginPayload = {
    nim,
    password,
    ...(existingDeviceId ? { device_id: existingDeviceId } : {}),
  };

  try {
    const { data } = await axiosClient.post<ApiResponse<LoginResponseData>>(
      API_ENDPOINTS.auth.login,
      payload
    );

    if (data?.data?.token) {
      setStoredToken(data.data.token);
      useAuthStore.getState().hydrateFromToken();
    }

    return data;

  } catch (err) {

    if (err instanceof AppError && err.message === "Device ID is required") {

      const newDeviceId = getDeviceId();

      const retryPayload: LoginPayload = {
        nim,
        password,
        device_id: newDeviceId,
      };

      const { data } = await axiosClient.post<ApiResponse<LoginResponseData>>(
        API_ENDPOINTS.auth.login,
        retryPayload
      );

      if (data?.data?.token) {
        setStoredToken(data.data.token);
        useAuthStore.getState().hydrateFromToken();
      }

      return data;
    }

    throw err;
  }
}