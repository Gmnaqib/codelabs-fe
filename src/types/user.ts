
export type UserType = {
  _id: string;
  nim: string;
  name: string;
  email: string;
  role: string;
  status: string;
  subriset: string;
  mac_address?: string;
  change_mac_address?: boolean;
  image?: string;
};

export type UserApiResponse = {
  _id?: string;
  nim?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  research?: string;
  change_device_id?: string;
  product_id?: string;
};

export interface LoginResponse {
  code: number;
  status: string;
  message: string;
  data: {
    id: string;
    name: string;
    nim: string;
    role: string;
    token: string;
  };
}
