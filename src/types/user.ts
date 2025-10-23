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
