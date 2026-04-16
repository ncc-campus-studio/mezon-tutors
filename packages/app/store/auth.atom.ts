'use client';

import authService from '@mezon-tutors/app/services/auth/auth.service';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type AuthUser = {
  id: string;
  mezonUserId: string;
  email: string | null;
  username: string | null;
  avatar?: string | null;
  role?: string | null;
};

type AuthUserSource = {
  sub?: string;
  id?: string;
  mezonUserId?: string;
  email?: string | null;
  username?: string | null;
  avatar?: string | null;
  role?: string | null;
};

function toAuthUser(source: AuthUserSource): AuthUser {
  return {
    id: source.sub ?? source.id ?? '',
    mezonUserId: source.mezonUserId ?? '',
    email: source.email ?? '',
    username: source.username ?? '',
    avatar: source.avatar ?? null,
    role: source.role ?? null,
  };
}

export const userAtom = atom<AuthUser | null>(null);
export const isLoadingAtom = atom<boolean>(true);

export const accessTokenAtom = atomWithStorage<string | null>('accessToken', null);

export const isAuthenticatedAtom = atom((get) => {
  return Boolean(get(accessTokenAtom) && get(userAtom));
});

export const initAuthAtom = atom(null, async (get, set) => {
  const token = get(accessTokenAtom);

  if (!token) {
    set(isLoadingAtom, false);
    return;
  }

  try {
    const data = await authService.getMe();
    set(userAtom, toAuthUser(data));
  } catch {
    set(accessTokenAtom, null);
    set(userAtom, null);
  } finally {
    set(isLoadingAtom, false);
  }
});

export const loginAtom = atom(
  null,
  async (_, set, { accessToken, user }: { accessToken: string; user?: AuthUserSource }) => {
    set(accessTokenAtom, accessToken);

    if (user?.mezonUserId) {
      set(userAtom, toAuthUser(user));
      return;
    }

    try {
      const data = await authService.getMe();
      set(userAtom, toAuthUser(data));
    } catch {
      set(accessTokenAtom, null);
      set(userAtom, null);
    }
  }
);

export const logoutAtom = atom(null, async (get, set) => {
  const token = get(accessTokenAtom);

  window.localStorage.removeItem('refreshToken');

  set(accessTokenAtom, null);
  set(userAtom, null);

  if (token) {
    try {
      await authService.logout();
    } catch {}
  }
});

export const getAuthUrlAtom = atom(null, async () => {
  return await authService.getAuthUrl();
});
