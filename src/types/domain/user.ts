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

export type UserStatus = 'active' | 'inactive' | 'graduated';

// Real values are lowercase (confirmed via API response: research: "website").
export const SUBRISET_OPTIONS = ['website', 'mobile', 'game', 'ui/ux', 'data', 'other'] as const;

export interface User {
  _id: string;
  nim: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  research?: string;
  image?: string;
  imageUpdatedAt?: string;
  macAddress?: string;
  changeMacAddress?: boolean;
  product_id?: string;
  // "Device Id" in the members table reflects this flag (confirmed via API
  // response: change_mac_address: true), not a separate change_device_id field.
  change_mac_address?: boolean;
}

export type CreateUserPayload = Omit<User, '_id'>;
export type UpdateUserPayload = Partial<CreateUserPayload>;
