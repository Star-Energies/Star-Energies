import type { CSSProperties } from "react";
import type { MediaAsset } from "@/types/content";
import { desktopMediaUrl, mobileMediaUrl } from "@/lib/responsive-media";

type MediaPlateProps = {
  asset: MediaAsset;
  className?: string;
  caption?: string;
};

export function MediaPlate({ asset, className = "", caption }: MediaPlateProps) {
  const captionText = caption ?? asset.caption;
  return (
    <figure className={`media-plate ${className}`}>
      <div className="media-plate__image" style={{ "--media-image": `url("${desktopMediaUrl(asset.url)}")`, "--media-image-mobile": `url("${mobileMediaUrl(asset.url)}")` } as CSSProperties} role="img" aria-label={asset.altText} />
      <div className="media-plate__scrim" />
      <figcaption><span>{asset.label}</span>{captionText && <span>{captionText}</span>}</figcaption>
    </figure>
  );
}
