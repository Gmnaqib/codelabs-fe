import { axiosClient } from "@/lib/axiosClient";
import { saveToken } from "@/lib/token";
import { LoginResponse } from "@/types/user";

export async function loginUser(nim: string, password: string): Promise<LoginResponse> {
  const { data } = await axiosClient.post("/auth/login", { nim, password });

  if (data?.data?.token) {
    saveToken(data.data.token);
  }

  return data;
}
