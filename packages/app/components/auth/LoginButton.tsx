'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  isAuthenticatedAtom,
  loginAtom,
  getAuthUrlAtom,
} from '@mezon-tutors/app/store/auth.atom';
import type { MezonAuthMessage } from '@mezon-tutors/shared/src/types/auth';
import { useTranslations } from 'next-intl';
import { Button } from '@mezon-tutors/app/ui';

const OAUTH_CHANNEL = 'mezon-oauth-result';

type LoginButtonProps = {
  label?: string;
  redirectTo?: string;
};

export function LoginButton({ label, redirectTo }: LoginButtonProps) {
  const t = useTranslations('Common.Header');
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const login = useSetAtom(loginAtom);
  const getAuthUrl = useSetAtom(getAuthUrlAtom);

  const popupRef = useRef<Window | null>(null);
  const intervalRef = useRef<number | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const cleanup = useCallback((reason?: string) => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }

    if (channelRef.current) {
      channelRef.current.close();
      channelRef.current = null;
    }
  }, []);

  const processOAuthPayload = useCallback(
    (payload: MezonAuthMessage) => {
      if (!payload) return;

      if (payload.type === 'MEZON_AUTH_SUCCESS') {
        const tokens = payload.data?.tokens;
        const loginUser = payload.data?.user;

        if (!tokens?.accessToken) {
          console.warn('[OAUTH] SUCCESS but missing accessToken');
          return;
        }

        if (tokens.refreshToken) {
          window.localStorage.setItem('refreshToken', tokens.refreshToken);
        }

        login({ accessToken: tokens.accessToken, user: loginUser });
        cleanup('success');

        if (redirectTo && window.location.pathname !== redirectTo) {
          window.location.assign(redirectTo);
        }
        return;
      }

      if (payload.type === 'MEZON_AUTH_ERROR') {
        console.error('[OAUTH] ERROR:', payload.error);
        cleanup('error');
      }
    },
    [login, cleanup, redirectTo]
  );

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const payload = event.data as MezonAuthMessage;

      if (payload?.type === 'MEZON_AUTH_SUCCESS' || payload?.type === 'MEZON_AUTH_ERROR') {
        processOAuthPayload(payload);
      }
    };

    window.addEventListener('message', handleMessage);

    try {
      const channel = new BroadcastChannel(OAUTH_CHANNEL);
      channel.onmessage = (event: MessageEvent) => {
        processOAuthPayload(event.data as MezonAuthMessage);
      };
      channelRef.current = channel;
    } catch (e) {
      console.warn('[OAUTH] BroadcastChannel not supported');
    }

    return () => {
      window.removeEventListener('message', handleMessage);
      cleanup('unmount');
    };
  }, [processOAuthPayload, cleanup]);

  const handleLoginClick = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      const width = 800;
      const height = 500;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        'about:blank',
        'mezon-oauth',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        console.error('[OAUTH] popup blocked');
        cleanup('popup_blocked');
        return;
      }

      popupRef.current = popup;

      const url = await getAuthUrl();
      popup.location.href = url;

      intervalRef.current = window.setInterval(() => {
        if (!popup || popup.closed) {
          cleanup('popup_closed');
        }
      }, 5000);
    } catch (error) {
      console.error('[OAUTH] start login error:', error);
      cleanup('catch');
    }
  }, [getAuthUrl, cleanup]);

  if (isAuthenticated) return null;

  return (
    <Button
      variant='primary'
      onPress={() => {
        void handleLoginClick();
      }}
      className="flex items-center gap-2 rounded-full border border-blue-400/60 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(29,102,242,0.45)] transition-all hover:bg-blue-500 hover:shadow-[0_10px_24px_rgba(29,102,242,0.55)]"
    >
      {label ?? t('login')}
    </Button>
  );
}
