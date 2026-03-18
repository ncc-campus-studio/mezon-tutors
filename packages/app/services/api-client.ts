import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from './token-storage';
import { env } from '../config/env';

export const BASE_URL = env.apiEndpoint;

/**
 * Custom API error for consistent error handling across the app.
 */
export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, statusText: string, body: unknown) {
    const msg =
      ((body as Record<string, unknown>)?.message as string) ||
      ((body as Record<string, unknown>)?.error as string) ||
      `API Error: ${status} ${statusText}`;
    super(msg);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/**
 * Shared promise for concurrent token refresh operations.
 * This ensures that multiple simultaneous 401s only trigger ONE refresh call.
 */
let refreshPromise: Promise<string> | null = null;

/**
 * Basic API Client using Axios
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the access token to every outgoing request
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = await tokenStorage.getAccessToken();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // FormData: let the browser set Content-Type with boundary; do not force application/json
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle data unwrapping and automatic token refresh
apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    // Auto-unwrap the standard API envelope: { data: T, error: string }
    if (body && typeof body === 'object' && 'data' in body && 'error' in body) {
      if (body.error) {
        throw new ApiError(response.status, 'API Error', body.error);
      }
      return body.data;
    }
    return body;
  },
  async (error: AxiosError) => {
    const config = error.config;

    // Logic for handling 401 Unauthorized (Expired Token)
    // We avoid retrying if the request itself was an auth call
    if (error.response?.status === 401 && config && !config.url?.includes('/auth/')) {
      try {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            const refreshToken = await tokenStorage.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            interface RefreshResponse {
              tokens: { accessToken: string };
            }
            const res = await axios.post<RefreshResponse, { data: RefreshResponse }>(
              `${BASE_URL}/auth/refresh`,
              { refreshToken }
            );
            const { accessToken } = res.data.tokens;

            await tokenStorage.setAccessToken(accessToken);
            return accessToken;
          })();
        }

        const token = await refreshPromise;

        // Reset promise for future refreshes
        refreshPromise = null;

        // Clone/Retry the original request with the fresh token
        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return apiClient.request(config);
      } catch (refreshError) {
        refreshPromise = null;
        await tokenStorage.clearTokens();
        return Promise.reject(refreshError);
      }
    }

    // Standardize all other errors into ApiError
    const status = error.response?.status || 500;
    const body = error.response?.data || null;
    return Promise.reject(new ApiError(status, error.message, body));
  }
);

// Module augmentation to simplify usage and improve React Query compatibility
// This allows calling: await apiClient.get<User>('/me') and getting User directly.
declare module 'axios' {
  export interface AxiosInstance {
    request<T = unknown, R = T>(config: AxiosRequestConfig): Promise<R>;
    get<T = unknown, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
    delete<T = unknown, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
    head<T = unknown, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
    options<T = unknown, R = T>(url: string, config?: AxiosRequestConfig): Promise<R>;
    post<T = unknown, R = T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R>;
    put<T = unknown, R = T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R>;
    patch<T = unknown, R = T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<R>;
  }
}
