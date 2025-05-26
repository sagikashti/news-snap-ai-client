import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '../config';
import type { ApiResult, ApiErrorResponse } from '../types';

// Create Axios instance with base configuration
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: config.ui.loadingTimeout,
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
          default:
            errorResponse.error = (data as any)?.error || `Server error (${status})`;
        }

        errorResponse.details = data;
      } else if (error.request) {
        // Network error
        errorResponse.error = 'Network error. Please check your connection.';
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

// Generic API request wrapper
export const apiRequest = async <T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, data?: any, params?: any): Promise<ApiResult<T>> => {
  try {
    const response = await apiClient.request<T>({
      method,
      url,
      data,
      params,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error is already processed by interceptor
    throw error;
  }
};

// Convenience methods
export const api = {
  get: <T>(url: string, params?: any) => apiRequest<T>('GET', url, undefined, params),
  post: <T>(url: string, data?: any) => apiRequest<T>('POST', url, data),
  put: <T>(url: string, data?: any) => apiRequest<T>('PUT', url, data),
  delete: <T>(url: string) => apiRequest<T>('DELETE', url),
};

export default api;
