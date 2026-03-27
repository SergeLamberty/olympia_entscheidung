import type { MetadataRoute } from "next";
import { loadSiteContent } from "@/lib/content-loader";

const ROUTES = [
  "",
  "/fragen",
  "/ergebnis",
  "/methodik",
  "/faq",
  "/ueber",
  "/impressum",
  "/datenschutz",
  "/info",
  "/info/ablauf",
  "/info/argumente",
  "/info/faq",
  "/info/quellen",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const site = loadSiteContent();
  const now = new Date();

  return ROUTES.map((route) => ({
    url: `${site.meta.siteUrl}${route || "/"}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
