import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoBuy Streak — Track Your No Buy Journey",
  description:
    "Gamified streak tracker for the No Buy movement. Set rules, check in daily, and share your progress.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
