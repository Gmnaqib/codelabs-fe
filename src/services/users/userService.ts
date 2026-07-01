import { axiosClient } from "@/lib/axiosClient";

export async function getAllUsers() {
    const {data} = await axiosClient.get("/users")
    const users = [...data.data];
    users.forEach(user => {
      if (user && typeof user.name === 'string' && user.name.length > 0) {
        user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
      }
    });
    const sorted = users.sort((a, b) => {
      if (!a.name || !b.name) return 0;
      return a.name.localeCompare(b.name, 'id', { sensitivity: 'base' });
    });
    return sorted;
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

export const createUser = async (payload: UserPayload) => {
  const res = await axiosClient.post("/auth/register", payload);
  return res.data;
};

export async function getMe() {
  const { data } = await axiosClient.get("/auth/me");
  const user = data.data;
  if (user && typeof user.name === 'string' && user.name.length > 0) {
    user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
  }
  return user;
}

export async function getUserById(id: string) {
  const { data } = await axiosClient.get(`/users/${id}`);
  return data.data;
}

export async function updateUser(id: string, payload: UserPayload) {
  const { data } = await axiosClient.patch(`/users/${id}`, payload);
  return data;
}

export const multipleRegisterUsers = async (payload: MultipleRegisterPayload) => {
  const res = await axiosClient.post("/auth/multiple-register", payload);
  return res.data;
};


export async function registerMacAddress() {
  const { data } = await axiosClient.patch(`/users/me/update-device`);
  return data;
}

