// Platform-specific storage implementation
// This file uses .web.ts and .native.ts extensions for platform-specific code
import { storage } from './token-storage-impl';

const ACCESS_TOKEN_KEY = 'accessToken';

export const tokenStorage = {
  async setAccessToken(token: string): Promise<void> {
    await storage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(token));
  },

  async getAccessToken(): Promise<string | null> {
    const raw = await storage.getItem(ACCESS_TOKEN_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as string;
    } catch {
      return raw;
    }
  },

  async clearTokens(): Promise<void> {
    await storage.removeItem(ACCESS_TOKEN_KEY);
  },
};
