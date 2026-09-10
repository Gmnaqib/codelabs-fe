import { isAxiosError } from 'axios';
import { showErrorToast } from '@/lib/toastHelper';

export class AppError extends Error {
  code: string;
  status: number;
  originalError?: unknown;

  constructor(code: string, status: number, message: string, originalError?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.originalError = originalError;
  }

  isNetworkError(): boolean {
    return this.status >= 500;
  }

  isClientError(): boolean {
    return this.status >= 400 && this.status <= 499;
  }

  isAuthError(): boolean {
    return this.status === 401;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isValidationError(): boolean {
    return this.status === 422;
  }
}

interface ApiErrorBody {
  message?: string;
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isAxiosError<ApiErrorBody>(error) && error.response) {
    const status = error.response.status;
    const message = error.response.data?.message ?? error.message;
    return new AppError('API_ERROR', status, message, error);
  }

  const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
  return new AppError('UNKNOWN_ERROR', 500, message, error);
}

export function showAppErrorToast(error: AppError): void {
  if (error.isAuthError()) {
    showErrorToast('Session expired, please log in again.');
    return;
  }
  if (error.isForbidden()) {
    showErrorToast('You do not have permission to perform this action.');
    return;
  }
  if (error.isValidationError()) {
    showErrorToast('Please check your input again.');
    return;
  }
  if (error.isNetworkError()) {
    showErrorToast('Server issue, please try again later.');
    return;
  }
  showErrorToast(error.message);
}
