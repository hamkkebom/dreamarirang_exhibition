import "../../site.css";
import type { Metadata } from "next";
import { FAVICON } from "@/lib/meta";

export const metadata: Metadata = {
  title: "관리자 | 제1회 헐버트 유물전",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  icons: { icon: [{ url: FAVICON, type: "image/svg+xml" }] },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen" style={{ lineHeight: 1.6 }}>
        {children}
      </body>
    </html>
  );
}
