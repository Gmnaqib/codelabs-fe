import type { ValidationError } from './error';

export type ApiStatus = 'success' | 'error';

export interface ApiResponse<T = unknown> {
  code: number;
  status: ApiStatus;
  message: string;
  data?: T;
}

export interface ApiSuccess<T> {
  code: number;
  status: 'success';
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  code: number;
  status: 'error';
  message: string;
  errors?: ValidationError[];
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}

export type PaginatedResponse<T> = ApiResponse<PaginatedData<T>>;
