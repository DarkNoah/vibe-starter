"use client";

import { GoogleAnalytics } from "nextjs-google-analytics";

export default function AnalyticsWrapper() {
  // 从环境变量获取 Google Analytics ID
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return <GoogleAnalytics trackPageViews />;
}
