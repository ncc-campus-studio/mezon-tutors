import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import './globals.css';
import { AppProviders } from './providers';
import AuthInitializer from '@mezon-tutors/app/components/AuthInitializer';
import { DEFAULT_THEME } from '@mezon-tutors/app';
import { getLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { cookies } from 'next/headers';
import { routing } from 'src/i18n/routing';
import Header from 'src/components/Header/Header';
import Footer from 'src/components/Footer/Footer';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestedLocale = await getLocale();
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
  const preferredLocale = cookieLocale ?? requestedLocale;
  const locale = hasLocale(routing.locales, preferredLocale)
    ? preferredLocale
    : routing.defaultLocale;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-theme={DEFAULT_THEME}
    >
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale}>
          <AppProviders>
            <AuthInitializer />
            <Header />
            {children}
            <Footer />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
