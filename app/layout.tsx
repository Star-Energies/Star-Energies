import { SiteChrome } from "@/components/site-chrome";
import { getSiteSettings } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import "./globals.css";
import "./mobile.css";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    return createMetadata((await getSiteSettings()).defaultSeo, false);
  } catch {
    // Next renders its global error boundary during a build before a database is
    // necessarily configured. Public requests still obtain editable metadata
    // from the CMS once the application has been configured and seeded.
    return createMetadata({
      title: "Star Energies",
      description: "Industrial coal sourcing and supply across India.",
    });
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteSettings = await getSiteSettings();
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><SiteChrome siteSettings={siteSettings}>{children}</SiteChrome></body>
    </html>
  );
}
