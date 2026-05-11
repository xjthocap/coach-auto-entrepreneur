import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/revenues",
          "/Expenses",
          "/history",
          "/settings",
          "/onboarding",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
          "/api/",
        ],
      },
    ],
    sitemap: "https://keskireste.fr/sitemap.xml",
  }
}
