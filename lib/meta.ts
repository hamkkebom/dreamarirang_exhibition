import type { Metadata, Viewport } from "next";
import { SITE_URL, verification } from "./site";

export const FAVICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎵</text></svg>";

export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&family=Noto+Sans+KR:wght@300;400;500;600&display=swap";

/** 공개 화면(한국어·영어) 공통 메타데이터 */
export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    robots: { index: true, follow: true },
    verification: verification(),
    icons: { icon: [{ url: FAVICON, type: "image/svg+xml" }] },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F9F8F2",
};
