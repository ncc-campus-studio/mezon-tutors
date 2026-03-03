import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from './providers';
import AuthInitializer from '@mezon-tutors/app/components/AuthInitializer';
import { ToastViewport } from '@mezon-tutors/app/ui';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mezon Learning | Find Your Best Language Tutor',
  description:
    'Learn faster with your best language tutor. Book experienced tutors for 120+ subjects.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>
          <AuthInitializer />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
