
export type UserType = {
  nim: string;
  name: string;
  email: string;
  role: string;
  status: string;
  subriset: string;
  change_device_id?: string;
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
