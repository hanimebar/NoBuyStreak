import type { Metadata } from "next";
import { VT323, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-retro",
});

const ibmMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "No-BS — No Buy Streak",
  description:
    "No-BS streak tracker for the No Buy movement. Set rules, check in daily, and share your progress.",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.svg", apple: "/logo-mark-192.png" },
  openGraph: {
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NoBuy Streak",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${vt323.variable} ${ibmMono.variable}`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="apple-touch-icon" href="/logo-mark-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
