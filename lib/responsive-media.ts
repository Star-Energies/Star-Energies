const optimizerWidths = [640, 750, 828, 1080, 1200, 1920] as const;

function isCloudinaryUpload(url: string) {
  return /^https:\/\/res\.cloudinary\.com\//.test(url) && url.includes("/image/upload/");
}

function isLocalImage(url: string) {
  return url.startsWith("/") && !url.startsWith("//");
}

function optimizedLocalUrl(url: string, width: number) {
  const target = optimizerWidths.find((candidate) => candidate >= width) ?? optimizerWidths[optimizerWidths.length - 1];
  return `/_next/image?url=${encodeURIComponent(url)}&w=${target}&q=75`;
}

/** Keep CMS media URLs intact while asking Cloudinary for a phone-sized variant. */
export function mobileMediaUrl(url: string, width = 900): string {
  if (isCloudinaryUpload(url)) return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,w_${width},c_limit/`);
  if (isLocalImage(url)) return optimizedLocalUrl(url, width);
  return url;
}

/** Full-width delivery: Cloudinary URLs are already capped at save time; bundled images are re-encoded on demand. */
export function desktopMediaUrl(url: string): string {
  return isLocalImage(url) ? optimizedLocalUrl(url, 1920) : url;
}
