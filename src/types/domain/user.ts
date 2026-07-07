export const USER_ROLES = [
  'admin',
  'lecturer',
  'president',
  'vice president',
  'user',
  'minister of research',
  'minister of competition',
  'minister of branding',
  'minister of operation',
] as const;

export type UserRole = typeof USER_ROLES[number];

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'resigned';

export interface User {
  _id: string;
  nim: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  subriset: string;
  image?: string;
  imageUpdatedAt?: string;
  macAddress?: string;
  changeMacAddress?: boolean;
}

export type CreateUserPayload = Omit<User, '_id'>;
export type UpdateUserPayload = Partial<CreateUserPayload>;
