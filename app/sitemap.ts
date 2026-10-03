import type { MetadataRoute } from "next";
import { privacyPage } from "@/content/privacy";
import { routes } from "@/content/routes";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return Object.values(routes)
    .filter((path) => !(path === routes.privacy && privacyPage.seo.noIndex))
    .map((path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : 0.6,
    }));
}
