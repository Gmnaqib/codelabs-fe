// import { axiosClient } from "@/lib/axiosClient";
// import { getToken } from "@/lib/token";

// export async function getAllUsers(): Promise<User[]> {
//     const {data} = await axiosClient.get("/users");
//     return data;
// }

// axiosClient.interceptors.request.use((config) => {
//   const token = getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

