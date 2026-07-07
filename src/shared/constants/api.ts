export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
  },
  operational: {
    records: '/operational-records',
  },
  users: {
    all: '/users',
  },
} as const;
