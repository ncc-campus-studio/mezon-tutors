'use client';

import '@tamagui/core/reset.css';
import '@tamagui/font-inter/css/400.css';
import '@tamagui/font-inter/css/700.css';
import '@tamagui/polyfill-dev';

import { useState, type ReactNode } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { NextThemeProvider } from '@tamagui/next-theme';
import { StyleSheet } from 'react-native';
import { config } from '../config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isWeb, TamaguiProvider } from 'tamagui';
import { ToastProvider, ToastViewport } from '@tamagui/toast';

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
    <NextThemeProvider
      skipNextHead
      defaultTheme="light"
      attribute="class"
    >
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider
          config={config}
          defaultTheme="light"
        >
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
    </NextThemeProvider>
  );
};
