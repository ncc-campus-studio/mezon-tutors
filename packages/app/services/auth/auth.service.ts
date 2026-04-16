import { apiClient } from '@mezon-tutors/app/services/api-client';
import { tokenStorage } from '@mezon-tutors/app/services/token-storage';

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
};

export type ExchangeResponse = {
  user: AuthUser & Record<string, unknown>;
  tokens: AuthTokens;
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

  async exchangeCode(code: string, state?: string): Promise<ExchangeResponse> {
    const data = await apiClient.post<ExchangeResponse>('/auth/mezon/exchange', { code, state });
    return data;
  }

  async getMe(): Promise<MeResponse> {
    const res = await apiClient.get<MeResponse>('/auth/me');
    return res;
  }

  async logout(): Promise<void> {
    const refreshToken = await tokenStorage.getRefreshToken();
    try {
      await apiClient.post('/auth/logout', { refreshToken });
    } finally {
      await tokenStorage.clearTokens();
    }
  }
}

export const authService = new AuthService();
export default authService;
