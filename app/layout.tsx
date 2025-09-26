"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { I18nProvider } from "@/components/i18n-provider";
import AnalyticsWrapper from "@/components/analytics/analytics-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { SWRConfig } from "swr";
import { DefaultSeo } from "next-seo";
import GlobalProviders from "@/components/GlobalProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overscroll-none`}
      >
        {/* <DefaultSeo
          titleTemplate="%s | MySite"
          defaultTitle="MySite"
          description="这是全站默认描述"
          openGraph={{
            type: "website",
            locale: "zh_CN",
            url: "https://mysite.com/",
            siteName: "MySite",
          }}
          twitter={{
            handle: "@mytwitter",
            site: "@mytwitter",
            cardType: "summary_large_image",
          }}
        /> */}
        <AnalyticsWrapper></AnalyticsWrapper>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <ConvexClientProvider>
              <I18nProvider>
                <GlobalProviders />
                <SWRConfig
                  value={{
                    fetcher: (url) => fetch(url).then((res) => res.json()),
                    dedupingInterval: 1000,
                    revalidateOnFocus: false,
                  }}
                >
                  {children}
                </SWRConfig>

                <Toaster />
              </I18nProvider>
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
