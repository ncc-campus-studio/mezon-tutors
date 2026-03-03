'use client';

import authService from '@mezon-tutors/app/services/auth/auth.service';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type AuthUser = {
  id: string;
  email: string | null;
  username: string | null;
  avatar?: string | null;
};

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

    set(userAtom, {
      id: data.sub ?? data.id ?? '',
      email: data.email ?? '',
      username: data.username ?? '',
      avatar: data.avatar ?? null,
    });
  } catch {
    set(accessTokenAtom, null);
    set(userAtom, null);
  } finally {
    set(isLoadingAtom, false);
  }
});

export const loginAtom = atom(null, async (_, set, { accessToken }: { accessToken: string }) => {
  set(accessTokenAtom, accessToken);

  try {
    const data = await authService.getMe();

    set(userAtom, {
      id: data.sub ?? data.id ?? '',
      email: data.email ?? '',
      username: data.username ?? '',
      avatar: data.avatar ?? null,
    });
  } catch {
    set(accessTokenAtom, null);
    set(userAtom, null);
  }
});

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
