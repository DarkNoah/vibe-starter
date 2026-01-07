import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "./providers";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
export const metadata: Metadata = {
  title: "Vibe Agent",
  description: "Vibe Agent - Your AI Assistant",
  keywords: ["AI", "Agent", "Assistant", "Vibe"],
  authors: [{ name: "Vibe Team" }],
  openGraph: {
    title: "Vibe Agent",
    description: "Vibe Agent - Your AI Assistant",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe Agent",
    description: "Vibe Agent - Your AI Assistant",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased overscroll-none`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
