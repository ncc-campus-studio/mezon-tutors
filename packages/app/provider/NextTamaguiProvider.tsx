'use client';

import '@tamagui/core/reset.css';
import '@tamagui/font-inter/css/400.css';
import '@tamagui/font-inter/css/700.css';
import '@tamagui/polyfill-dev';

import { useEffect, useState, type ReactNode } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleSheet } from 'react-native';
import { config, DEFAULT_THEME } from '../config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isWeb, TamaguiProvider, Theme, useThemeName } from 'tamagui';
import { ToastProvider, ToastViewport } from '@tamagui/toast';

/** Syncs Tamagui theme to html[data-theme] for CSS (e.g. autofill styles). */
function ThemeSyncToDataAttribute() {
  const themeName = useThemeName();
  useEffect(() => {
    if (typeof document !== 'undefined' && themeName) {
      document.documentElement.setAttribute('data-theme', themeName);
    }
  }, [themeName]);
  return null;
}

export const NextTamaguiProvider = ({ children }: { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<'light' | 'dark'>(DEFAULT_THEME as 'light' | 'dark');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedTheme = window.localStorage.getItem('app-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeName(savedTheme);
      return;
    }

    const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setThemeName(preferDark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onThemeChange = (event: Event) => {
      const nextTheme = (event as CustomEvent<'light' | 'dark'>).detail;
      if (nextTheme === 'light' || nextTheme === 'dark') {
        setThemeName(nextTheme);
      }
    };

    window.addEventListener('app-theme-change', onThemeChange as EventListener);
    return () => {
      window.removeEventListener('app-theme-change', onThemeChange as EventListener);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', themeName);
    window.localStorage.setItem('app-theme', themeName);
  }, [themeName]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 300_000,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            refetchOnMount: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  useServerInsertedHTML(() => {
    // @ts-ignore
    const rnwStyle = StyleSheet.getSheet();
    return (
      <>
        <link
          rel="stylesheet"
          href="/tamagui.css"
        />
        <style
          dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }}
          id={rnwStyle.id}
        />
        <style dangerouslySetInnerHTML={{ __html: config.getNewCSS() }} />
        <style
          dangerouslySetInnerHTML={{
            __html: config.getCSS({
              exclude: process.env.NODE_ENV === 'production' ? 'design-system' : null,
            }),
          }}
        />
      </>
    );
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TamaguiProvider
        config={config}
        defaultTheme={themeName}
      >
        <Theme name={themeName}>
          <ThemeSyncToDataAttribute />
          <ToastProvider
            swipeDirection="horizontal"
            duration={6000}
            native={isWeb ? [] : ['mobile']}
          >
            <ToastViewport />
            {children}
          </ToastProvider>
        </Theme>
      </TamaguiProvider>
    </QueryClientProvider>
  );
};
