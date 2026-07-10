import { axiosClient } from "@/lib/axiosClient";
import { handleError } from "@/shared/services";

export interface RawUserRecord {
  _id: string;
  nim: string;
  name: string;
  email: string;
  role: string;
  status: string;
  mac_address?: string;
  change_mac_address?: boolean;
  image?: string;
  image_updated_at?: string;
  research?: string;
  product_id?: string;
  change_device_id?: boolean;
  [key: string]: unknown;
}

export async function getAllUsers(): Promise<RawUserRecord[]> {
  try {
    const { data } = await axiosClient.get("/users");
    const users = [...data.data] as RawUserRecord[];
    users.forEach((user) => {
      if (user && typeof user.name === 'string' && user.name.length > 0) {
        user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
      }
    });
    const sorted = users.sort((a, b) => {
      if (!a.name || !b.name) return 0;
      return a.name.localeCompare(b.name, 'id', { sensitivity: 'base' });
    });
    return sorted;
  } catch (error) {
    throw handleError(error);
  }
}


export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  [key: string]: unknown;
}

export interface MultipleRegisterPayload {
  emails: string[];
}

export const createUser = async (payload: UserPayload): Promise<RawUserRecord> => {
  try {
    const res = await axiosClient.post("/auth/register", payload);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

export async function getMe(): Promise<RawUserRecord> {
  try {
    const { data } = await axiosClient.get("/auth/me");
    const user = data.data as RawUserRecord;
    if (user && typeof user.name === 'string' && user.name.length > 0) {
      user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
    }
    return user;
  } catch (error) {
    throw handleError(error);
  }
}

export async function getUserById(id: string): Promise<RawUserRecord> {
  try {
    const { data } = await axiosClient.get(`/users/${id}`);
    return data.data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function updateUser(id: string, payload: Partial<UserPayload>): Promise<RawUserRecord> {
  try {
    const { data } = await axiosClient.patch(`/users/${id}`, payload);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export const multipleRegisterUsers = async (payload: MultipleRegisterPayload): Promise<unknown> => {
  try {
    const res = await axiosClient.post("/auth/multiple-register", payload);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};


export async function registerMacAddress(): Promise<unknown> {
  try {
    const { data } = await axiosClient.patch(`/users/me/update-device`);
    return data;
  } catch (error) {
    throw handleError(error);
  }
}

export async function updateMe(formData: FormData): Promise<unknown> {
  try {
    const { data } = await axiosClient.patch(`/users/me`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    throw handleError(error);
  }
}
