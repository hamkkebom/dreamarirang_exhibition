import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// 모든 검색·AI 검색 봇을 허용하고, 관리자 화면과 API만 제외한다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
