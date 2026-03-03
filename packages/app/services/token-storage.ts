// Platform-specific storage implementation
// This file uses .web.ts and .native.ts extensions for platform-specific code
import { storage } from './token-storage-impl';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

export const tokenStorage = {
  async setAccessToken(token: string): Promise<void> {
    await storage.setItem(ACCESS_TOKEN_KEY, token);
  },

  async getAccessToken(): Promise<string | null> {
    const raw = localStorage.getItem('accessToken');
    return raw ? JSON.parse(raw) : null;
  },

  async setRefreshToken(token: string): Promise<void> {
    await storage.setItem(REFRESH_TOKEN_KEY, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return await storage.getItem(REFRESH_TOKEN_KEY);
  },

  async clearTokens(): Promise<void> {
    await storage.removeItem(ACCESS_TOKEN_KEY);
    await storage.removeItem(REFRESH_TOKEN_KEY);
  },
};
