import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

console.log("🚀 API URL USED:", API_URL);

export const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("📡 Request to:", `${config.baseURL}${config.url}`);
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error("❌ API ERROR:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.warn("Unauthorized - token sudah kadaluarsa");
    }

    return Promise.reject(error);
  }
);
