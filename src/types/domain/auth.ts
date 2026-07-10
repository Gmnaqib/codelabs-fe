import type { UserRole } from './user';

export interface AuthUser {
  id: string;
  name: string;
  nim: string;
  role: UserRole;
  email?: string;
  status?: string;
  major?: string;
  deviceId?: string | null;
}

export interface LoginPayload {
  nim: string;
  password: string;
  device_id?: string;
}

export interface LoginResponseData {
  id: string;
  name: string;
  nim: string;
  role: string;
  token: string;
}

export interface JwtPayload {
  id: string;
  name: string;
  nim: string;
  role: string;
  major?: string;
  status?: string;
  device_id?: string;
  change_device_id?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}
