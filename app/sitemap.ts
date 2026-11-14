import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { AUTHORS, SITE_URL } from "@/lib/site";

// 발행·수정이 바로 보이도록 요청 때마다 DB에서 만든다 (작고 가벼운 응답)
export const dynamic = "force-dynamic";

// 첫 화면 두 장의 마지막 내용 수정일. 첫 화면 글을 고치면 함께 바꾼다.
const HOME_UPDATED = new Date("2026-11-13T00:00:00+09:00");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const latest = posts.reduce<Date | null>((m, p) => (!m || p.updated_at > m ? p.updated_at : m), null);
  const languages = { ko: `${SITE_URL}/`, en: `${SITE_URL}/en/`, "x-default": `${SITE_URL}/` };

  return [
    { url: `${SITE_URL}/`, lastModified: HOME_UPDATED, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: `${SITE_URL}/en/`, lastModified: HOME_UPDATED, changeFrequency: "monthly", priority: 0.8, alternates: { languages } },
    { url: `${SITE_URL}/blog/`, lastModified: latest ?? HOME_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    ...AUTHORS.map((a) => ({
      url: `${SITE_URL}/authors/${a.slug}/`,
      lastModified: latest ?? HOME_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}/`,
      lastModified: p.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
