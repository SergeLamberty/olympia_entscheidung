import type { MetadataRoute } from "next";
import { loadSiteContent } from "@/lib/content-loader";

export default function robots(): MetadataRoute.Robots {
  const site = loadSiteContent();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.meta.siteUrl}/sitemap.xml`,
    host: site.meta.siteUrl,
  };
}
