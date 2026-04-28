'use client';

import type { ReactNode } from 'react';
import AuthInitializer from '@/components/auth/AuthInitializer';
import { Toaster } from '@/components/ui';
import { QueryProvider } from './QueryProvider';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthInitializer />
      {children}
      <Toaster />
    </QueryProvider>
  );
}
