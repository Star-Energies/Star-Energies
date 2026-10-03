import type { Metadata } from "next";
import type { SeoMetadata } from "@/types/content";
import { getSiteUrl } from "@/lib/site-url";

const defaultOgImage = "/images/logo/star-full-256.png";

/** Converts editable SEO content into Next metadata, anchored to the public site origin. */
export function createMetadata(seo: SeoMetadata, path?: string | false): Metadata {
  const canonicalPath = path === false ? undefined : seo.canonicalPath ?? path;
  const ogTitle = seo.ogTitle ?? seo.title;
  const ogDescription = seo.ogDescription ?? seo.description;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: seo.title,
    description: seo.description,
    alternates: canonicalPath ? { canonical: canonicalPath } : undefined,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [
        { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(canonicalPath ? { url: canonicalPath } : {}),
      siteName: "Star Energies",
      type: "website",
      images: [{ url: defaultOgImage, width: 512, height: 512 }],
    },
    twitter: {
      card: "summary",
      title: ogTitle,
      description: ogDescription,
      images: [defaultOgImage],
    },
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
  };
}
