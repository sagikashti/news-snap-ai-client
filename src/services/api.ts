import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { config } from '../config';
import type { ApiResult, ApiErrorResponse, RetryOptions } from '../types';

// Utility to dismiss all toasts
const dismissAllToasts = () => {
  toast.dismiss();
};

// Retry configuration
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delay: 1000,
  backoff: true,
};

// Sleep utility for delays
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Calculate delay with exponential backoff
const calculateDelay = (attempt: number, baseDelay: number, useBackoff: boolean): number => {
  if (!useBackoff) return baseDelay;
  return baseDelay * Math.pow(2, attempt - 1);
};

// Create Axios instance with base configuration
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: 30000, // Increased timeout for slow APIs
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add timestamp to prevent caching
      config.params = {
        ...config.params,
        _t: Date.now(),
      };

      // Log request in development
      if (import.meta.env.DEV) {
        console.log('API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
        });
      }

      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development
      if (import.meta.env.DEV) {
        console.log('API Response:', {
          status: response.status,
          data: response.data,
        });
      }

      return response;
    },
    (error: AxiosError) => {
      // Handle different error types
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: 'An unexpected error occurred',
        code: error.response?.status,
      };

      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        switch (status) {
          case 400:
            errorResponse.error = 'Invalid request. Please check your input.';
            break;
          case 401:
            errorResponse.error = 'Unauthorized. Please check your credentials.';
            break;
          case 403:
            errorResponse.error = 'Access forbidden.';
            break;
          case 404:
            errorResponse.error = 'Resource not found.';
            break;
          case 429:
            errorResponse.error = 'Too many requests. Please try again later.';
            break;
          case 500:
            errorResponse.error = 'Server error. Please try again later.';
            break;
          case 502:
          case 503:
          case 504:
            errorResponse.error = 'Service temporarily unavailable. Retrying...';
            break;
          default:
            errorResponse.error = (data as any)?.error || `Server error (${status})`;
        }

        errorResponse.details = data;
      } else if (error.request) {
        // Network error
        if (error.code === 'ECONNABORTED') {
          errorResponse.error = 'Request timeout. The API is taking longer than expected.';
        } else {
          errorResponse.error = 'Network error. Please check your connection.';
        }
      } else {
        // Request setup error
        errorResponse.error = error.message || 'Request failed';
      }

      console.error('API Error:', errorResponse);
      return Promise.reject(errorResponse);
    }
  );

  return instance;
};

// Create the API instance
export const apiClient = createApiInstance();

// Enhanced API request wrapper with retry logic
export const apiRequestWithRetry = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  params?: any,
  retryOptions: RetryOptions = {}
): Promise<ApiResult<T>> => {
  const options = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
  let lastError: ApiErrorResponse | null = null;
  let toastId: string | null = null;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      // Show retry toast for attempts > 1
      if (attempt > 1) {
        const delay = calculateDelay(attempt - 1, options.delay, options.backoff);

        if (toastId) {
          toast.dismiss(toastId);
        }

        toastId = toast.loading(
          `🤔 Attempt ${attempt}/${options.maxAttempts} - API is slow, retrying in ${Math.round(delay / 1000)}s...`,
          {
            duration: delay,
          }
        );

        await sleep(delay);

        if (toastId) {
          toast.dismiss(toastId);
        }
      }

      // Show thinking toast for first attempt (with slight delay to let initial toast show)
      if (attempt === 1) {
        // Small delay to ensure smooth transition from initial analysis toast
        await sleep(200);
        toastId = toast.loading('🧠 Getting your summary...');
      }

      const response = await apiClient.request<T>({
        method,
        url,
        data,
        params,
      });

      // Success - dismiss loading toast
      if (toastId) {
        toast.dismiss(toastId);
      }

      // Show success toast
      toast.success('✨ Summary ready!', {
        duration: 2000,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      lastError = error as ApiErrorResponse;

      // Dismiss ALL toasts when error occurs
      dismissAllToasts();

      // Reset toastId since all toasts are dismissed
      toastId = null;

      // Check if we should retry
      const shouldRetry = attempt < options.maxAttempts && isRetryableError(lastError);

      if (!shouldRetry) {
        // Final failure - create dismissible error toast after a brief delay
        const errorMessage = lastError.error;
        setTimeout(() => {
          toast.error(` ${errorMessage}`, {
            duration: 500, // Reasonable duration
            id: 'api-error', // Unique ID to prevent duplicates
          });
        }, 100); // Small delay to ensure clean slate
        break;
      }

      console.warn(`Attempt ${attempt} failed, retrying...`, lastError);
    }
  }

  // All attempts failed
  throw lastError;
};

// Check if error is retryable
const isRetryableError = (error: ApiErrorResponse): boolean => {
  if (!error.code) return true; // Network errors are retryable

  // Retry on server errors and timeouts
  return error.code >= 500 || error.code === 429 || error.error.includes('timeout');
};

// Generic API request wrapper (backwards compatibility)
export const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  params?: any
): Promise<ApiResult<T>> => {
  return apiRequestWithRetry<T>(method, url, data, params);
};

// Convenience methods
export const api = {
  get: <T>(url: string, params?: any, retryOptions?: RetryOptions) =>
    apiRequestWithRetry<T>('GET', url, undefined, params, retryOptions),
  post: <T>(url: string, data?: any, retryOptions?: RetryOptions) =>
    apiRequestWithRetry<T>('POST', url, data, undefined, retryOptions),
  put: <T>(url: string, data?: any, retryOptions?: RetryOptions) =>
    apiRequestWithRetry<T>('PUT', url, data, undefined, retryOptions),
  delete: <T>(url: string, retryOptions?: RetryOptions) =>
    apiRequestWithRetry<T>('DELETE', url, undefined, undefined, retryOptions),
};

export default api;
