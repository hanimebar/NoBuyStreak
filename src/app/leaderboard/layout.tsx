import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard — Top No Buy Streaks",
  description: "See the longest No Buy streaks from real people. Filter by category, sort by savings. Join the No Buy movement on NoBuy Streak.",
  alternates: { canonical: "https://nobuystreak.com/leaderboard" },
  openGraph: {
    title: "NoBuy Streak Leaderboard — Real Streaks From Real People",
    description: "The longest No Buy streaks on the internet. Filter by category, search by name, download the full list.",
    url: "https://nobuystreak.com/leaderboard",
  },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
