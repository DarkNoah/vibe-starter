"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "@/components/i18n-provider";
import AnalyticsWrapper from "@/components/analytics/analytics-wrapper";
import { Toaster } from "@/components/ui/sonner";
import { SWRConfig } from "swr";
import GlobalProviders from "@/components/GlobalProviders";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnalyticsWrapper />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider>
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
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
