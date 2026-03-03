import { apiClient } from '@mezon-tutors/app/services/api-client';

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type AuthUser = {
  id: string;
  email: string;
  avatar?: string | null;
};

export type ExchangeResponse = {
  user: AuthUser & Record<string, unknown>;
  tokens: AuthTokens;
};

export type MeResponse = {
  sub?: string;
  id?: string;
  email?: string;
  username?: string;
  avatar?: string | null;
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
    await apiClient.post('/auth/logout');
  }
}

export const authService = new AuthService();
export default authService;
