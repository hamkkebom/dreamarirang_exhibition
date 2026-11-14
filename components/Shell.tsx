import { Analytics } from "@vercel/analytics/next";
import { FONT_HREF } from "@/lib/meta";

/** 공개 화면의 <html> 뼈대. 언어별 루트 레이아웃이 함께 쓴다. */
export default function Shell({ lang, children }: { lang: "ko" | "en"; children: React.ReactNode }) {
  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href={FONT_HREF} rel="stylesheet" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
