export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  context?: Record<string, unknown>;
}
