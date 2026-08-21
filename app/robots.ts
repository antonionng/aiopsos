import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://experrt.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Signed-in surfaces, one-time assessment links and individual
        // certificates have no business in an index. The certificate pages in
        // particular name a person; the holder shares the link, a crawler
        // should not surface it.
        disallow: [
          "/dashboard/",
          "/api/",
          "/assess/",
          "/assessment/",
          "/verify/",
          "/shared/",
          "/login",
          "/register",
          "/reset-password",
          "/forgot-password",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
