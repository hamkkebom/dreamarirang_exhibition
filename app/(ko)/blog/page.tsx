import type { Metadata } from "next";
import PageTop, { Breadcrumb, SiteFooter } from "@/components/PageTop";
import { getPublishedPosts } from "@/lib/posts";
import { koDate } from "@/lib/format";
import { JsonLd, breadcrumbLd } from "@/lib/jsonld";
import { SITE_URL, POSTER, SITE_NAME } from "@/lib/site";

// 발행·수정 때 서버 동작이 바로 갱신한다. 혹시 놓쳐도 하루에 한 번은 새로 만든다.
export const revalidate = 86400;

const title = "아리랑 칼럼";
const description = "아리랑과 호머 헐버트, 1896년 아리랑 채보에 관한 함께봄 편집팀의 칼럼 목록입니다.";

export const metadata: Metadata = {
  title: `${title} | ${SITE_NAME}`,
  description,
  alternates: { canonical: "/blog/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/blog/",
    siteName: `${SITE_NAME} | 함께봄`,
    title,
    description,
    images: [{ url: POSTER.path, width: POSTER.width, height: POSTER.height }],
  },
  twitter: { card: "summary_large_image", title, description, images: [POSTER.path] },
};

export default async function BlogIndex() {
  const posts = await getPublishedPosts();
  return (
    <>
      <PageTop />
      <main>
        <section className="page-head">
          <div className="site-container">
            <Breadcrumb items={[{ name: "홈", href: "/" }, { name: "칼럼" }]} />
            <h1 className="page-title">{title}</h1>
            <p className="page-lead">{description}</p>
          </div>
        </section>
        <section style={{ paddingTop: 0 }}>
          <div className="site-container">
            {posts.length === 0 ? (
              <p className="empty-note">아직 발행된 칼럼이 없습니다.</p>
            ) : (
              <div className="post-list">
                {posts.map((p) => (
                  <a className="post-card" href={`/blog/${p.slug}/`} key={p.id}>
                    {p.category && <span className="post-category">{p.category}</span>}
                    <h2>{p.title}</h2>
                    {p.summary && <p>{p.summary}</p>}
                    {p.published_at && <time dateTime={p.published_at.toISOString()}>{koDate(p.published_at)}</time>}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
      <JsonLd
        data={breadcrumbLd([
          { name: "홈", url: `${SITE_URL}/` },
          { name: "칼럼", url: `${SITE_URL}/blog/` },
        ])}
      />
    </>
  );
}
