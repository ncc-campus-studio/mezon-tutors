import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import "./globals.css";
import { Footer, Header } from "@/components/layouts";
import { AppProvider } from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mezonly",
  description: "Mezon Tutors landing page",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestedLocale = await getLocale();
  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value;
  const locale = cookieLocale ?? requestedLocale;
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <NextIntlClientProvider locale={locale}>
          <AppProvider>
            <Header />
            {children}
            <Footer />
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
