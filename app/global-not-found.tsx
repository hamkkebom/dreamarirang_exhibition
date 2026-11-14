import "./site.css";
import type { Metadata } from "next";
import { FAVICON, FONT_HREF } from "@/lib/meta";
import NotFoundBody from "@/components/NotFound";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 | 제1회 헐버트 유물전",
  robots: { index: false },
  icons: { icon: [{ url: FAVICON, type: "image/svg+xml" }] },
};

export default function GlobalNotFound() {
  return (
    <html lang="ko">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href={FONT_HREF} rel="stylesheet" />
      </head>
      <body>
        <NotFoundBody />
      </body>
    </html>
  );
}
