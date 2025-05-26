// Global types and interfaces

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Summary Types
export interface SummaryRequest {
  url: string;
}

export interface SummaryResponse {
  summary: string;
  title?: string;
  keywords?: string[];
  insights?: string[];
  originalUrl: string;
  processedAt: string;
  wordCount?: number;
  readingTime?: number;
  author?: string[];
  publisher?: string;
  summaryLength?: number;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Form Types
export interface UrlFormData {
  url: string;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  mode: ThemeMode;
}

// Navigation Types
export interface RouteParams {
  [key: string]: string | undefined;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// API Error Response
export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: number;
  details?: any;
}

// Success Response
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Union type for API responses
export type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;
