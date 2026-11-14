import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTop, { Breadcrumb, SiteFooter } from "@/components/PageTop";
import { AUTHORS, SITE_NAME, SITE_URL, ORG, LOGO, abs } from "@/lib/site";
import { getPublishedPostsByAuthor } from "@/lib/posts";
import { koDate } from "@/lib/format";
import { JsonLd, breadcrumbLd, authorUrl } from "@/lib/jsonld";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: PageProps<"/authors/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = AUTHORS.find((x) => x.slug === slug);
  if (!a) return {};
  return {
    title: `${a.name} | ${SITE_NAME}`,
    description: a.description,
    alternates: { canonical: `/authors/${a.slug}/` },
    openGraph: { type: "profile", locale: "ko_KR", url: `/authors/${a.slug}/`, title: a.name, description: a.description },
  };
}

export default async function AuthorPage({ params }: PageProps<"/authors/[slug]">) {
  const { slug } = await params;
  const a = AUTHORS.find((x) => x.slug === slug);
  if (!a) notFound();
  const posts = await getPublishedPostsByAuthor(a.name);

  return (
    <>
      <PageTop />
      <main>
        <section className="page-head">
          <div className="site-container">
            <Breadcrumb items={[{ name: "홈", href: "/" }, { name: "칼럼", href: "/blog/" }, { name: a.name }]} />
            <h1 className="page-title">{a.name}</h1>
            <p className="page-lead">{a.description}</p>
            <p className="post-meta">
              <span>
                소속 <strong>{ORG.name}</strong>
              </span>
              {a.sameAs.map((u) => (
                <a key={u} href={u} target="_blank" rel="noopener noreferrer me">
                  인스타그램
                </a>
              ))}
            </p>
          </div>
        </section>
        <section style={{ paddingTop: 0 }}>
          <div className="site-container">
            <h2 className="section-heading" style={{ fontSize: 20 }}>
              쓴 칼럼
            </h2>
            {posts.length === 0 ? (
              <p className="empty-note">아직 발행된 칼럼이 없습니다.</p>
            ) : (
              <div className="post-list">
                {posts.map((p) => (
                  <a className="post-card" href={`/blog/${p.slug}/`} key={p.id}>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "var(--color-primary)" }}>{p.title}</h3>
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
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            url: authorUrl(a),
            mainEntity: {
              "@type": a.kind,
              name: a.name,
              description: a.description,
              url: authorUrl(a),
              sameAs: a.sameAs,
              ...(a.kind === "Organization"
                ? { parentOrganization: { "@type": "Organization", name: ORG.name, logo: abs(LOGO.path) } }
                : { worksFor: { "@type": "Organization", name: ORG.name } }),
            },
          },
          breadcrumbLd([
            { name: "홈", url: `${SITE_URL}/` },
            { name: "칼럼", url: `${SITE_URL}/blog/` },
            { name: a.name, url: authorUrl(a) },
          ]),
        ]}
      />
    </>
  );
}
