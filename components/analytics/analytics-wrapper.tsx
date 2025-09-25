"use client";

import { GoogleAnalytics } from "nextjs-google-analytics";

export default function AnalyticsWrapper() {
  return <GoogleAnalytics trackPageViews />;
}
