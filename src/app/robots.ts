import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/leaderboard", "/pricing", "/privacy", "/terms", "/login"],
        disallow: ["/app/", "/api/", "/auth/", "/onboarding"],
      },
    ],
    sitemap: "https://nobuystreak.actvli.com/sitemap.xml",
  };
}
