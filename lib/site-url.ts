import "server-only";

/** Resolves the public site origin for absolute URLs (emails, canonical tags, OG metadata). */
export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, "");
  // Mail clients and crawlers need a public, HTTPS-hosted origin. Localhost
  // URLs used during development cannot be reached by either.
  return configured && /^https:\/\//i.test(configured) ? configured : "https://starenergies.in";
}
