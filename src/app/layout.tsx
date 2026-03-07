import type { Metadata } from "next";
import { VT323, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics";
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
  title: {
    default: "NoBuy Streak — Turn Spending Restraint Into a Streak",
    template: "%s — NoBuy Streak",
  },
  description:
    "The No Buy streak tracker for the underconsumption movement. Set No Buy rules, check in daily, track money saved, and share your progress. Join thousands keeping their streak.",
  keywords: [
    "no buy challenge", "no buy streak", "underconsumption", "spending tracker",
    "no spend challenge", "habit tracker", "money saved", "no buy 2026",
    "no buy app", "spending restraint", "frugal living", "financial wellness",
  ],
  authors: [{ name: "Äctvli Responsible Consulting" }],
  creator: "Äctvli Responsible Consulting",
  metadataBase: new URL("https://nobuystreak.actvli.com"),
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  icons: { icon: "/favicon.svg", apple: "/logo-mark-192.png" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nobuystreak.actvli.com",
    siteName: "NoBuy Streak",
    title: "NoBuy Streak — Turn Spending Restraint Into a Streak",
    description: "The No Buy streak tracker for the underconsumption movement. Set rules, check in daily, track money saved.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NoBuy Streak — No BS spending restraint tracker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NoBuy Streak — Turn Spending Restraint Into a Streak",
    description: "The No Buy streak tracker for the underconsumption movement.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NoBuy Streak",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
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
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
