import { apiClient } from '@mezon-tutors/app/services/api-client';
import { tokenStorage } from '../storage/token-storage';

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type AuthUser = {
  id?: string;
  mezonUserId?: string;
  username?: string;
  email?: string | null;
  avatar?: string | null;
  role?: string;
  idToken?: string | null;
};

export type ExchangeResponse = {
  user: AuthUser & Record<string, unknown>;
  accessToken: string;
  idToken?: string | null;
};

export type MeResponse = {
  sub?: string;
  id?: string;
  mezonUserId?: string;
  email?: string;
  username?: string;
  avatar?: string | null;
  role?: string;
};

type AuthUrlResponse = {
  url: string;
};

class AuthService {
  async getAuthUrl(): Promise<string> {
    const res = await apiClient.get<AuthUrlResponse>(`/auth/url`);
    return res.url;
  }

  async exchangeCode(code: string, state: string): Promise<ExchangeResponse> {
    const data = await apiClient.post<ExchangeResponse>('/auth/mezon/exchange', { code, state });
    return data;
  }

  async getMe(): Promise<MeResponse> {
    const res = await apiClient.get<MeResponse>('/auth/me');
    return res;
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    const data = await apiClient.post<{ accessToken: string }>('/auth/refresh');
    return data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      await tokenStorage.clearTokens();
    }
  }
}

export const authService = new AuthService();
export default authService;
