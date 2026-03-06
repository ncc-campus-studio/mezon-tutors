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
import { isWeb, TamaguiProvider, useThemeName } from 'tamagui';
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
  const [queryClient] = useState(() => new QueryClient());

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
        defaultTheme={DEFAULT_THEME}
      >
        <ThemeSyncToDataAttribute />
        <ToastProvider
          swipeDirection="horizontal"
          duration={6000}
          native={isWeb ? [] : ['mobile']}
        >
          <ToastViewport />
          {children}
        </ToastProvider>
      </TamaguiProvider>
    </QueryClientProvider>
  );
};
