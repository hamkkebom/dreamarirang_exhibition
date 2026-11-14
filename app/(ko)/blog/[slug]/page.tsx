import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import PageTop, { Breadcrumb, SiteFooter } from "@/components/PageTop";
import { getPublishedPost, getPublishedPosts } from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { koDate, safeSlug } from "@/lib/format";
import { JsonLd, articleLd, breadcrumbLd, faqLd, postUrl, authorUrl, ogImagePath } from "@/lib/jsonld";
import { SITE_URL, SITE_NAME, abs, authorByName } from "@/lib/site";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    return (await getPublishedPosts()).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

const load = cache(async (slug: string) => getPublishedPost(safeSlug(slug)));

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await load(slug);
  if (!post) return { title: "찾을 수 없는 칼럼", robots: { index: false } };
  const url = `/blog/${post.slug}/`;
  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.summary,
    keywords: post.tags,
    authors: [{ name: post.author_name, url: authorByName(post.author_name) ? authorUrl(authorByName(post.author_name)!) : undefined }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url,
      siteName: `${SITE_NAME} | 함께봄`,
      title: post.title,
      description: post.summary,
      publishedTime: post.published_at?.toISOString(),
      modifiedTime: post.updated_at.toISOString(),
      authors: [post.author_name],
      section: post.category || undefined,
      tags: post.tags,
      images: [{ url: ogImagePath(post.slug), width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [{ url: ogImagePath(post.slug), alt: post.title }],
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await load(slug);
  if (!post) notFound();

  const { html, toc, images } = await renderMarkdown(post.content_mdx);
  const author = authorByName(post.author_name);
  const published = post.published_at!;
  const modified = post.updated_at;
  const showModified = modified.getTime() - published.getTime() > 60_000;

  const ldImages = [abs(ogImagePath(post.slug)), ...images.filter((i) => i.src).map((i) => abs(i.src))];

  return (
    <>
      <PageTop />
      <main>
        <article>
          <header className="page-head">
            <div className="site-container">
              <Breadcrumb items={[{ name: "홈", href: "/" }, { name: "칼럼", href: "/blog/" }, { name: post.title }]} />
              {post.category && <p className="post-category">{post.category}</p>}
              <h1 className="page-title">{post.title}</h1>
              {post.summary && <p className="page-lead">{post.summary}</p>}
              <p className="post-meta">
                <span>
                  글{" "}
                  {author ? <a href={`/authors/${author.slug}/`} rel="author">{post.author_name}</a> : post.author_name}
                </span>
                <span>
                  처음 발행 <time dateTime={published.toISOString()}>{koDate(published)}</time>
                </span>
                <span>
                  마지막 수정 <time dateTime={modified.toISOString()}>{koDate(showModified ? modified : published)}</time>
                </span>
              </p>
            </div>
          </header>

          <div className="site-container" style={{ paddingBottom: 64 }}>
            {toc.length > 1 && (
              <nav className="toc" aria-labelledby="toc-title">
                <h2 id="toc-title">목차</h2>
                <ol>
                  {toc.map((t) => (
                    <li key={t.id} className={`toc-${t.depth}`}>
                      <a href={`#${t.id}`}>{t.text}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

            {post.faq_json.length > 0 && (
              <section className="faq" aria-labelledby="faq-title">
                <h2 id="faq-title">자주 묻는 질문</h2>
                {post.faq_json.map((f, i) => (
                  <div className="faq-item" key={i}>
                    <h3>{f.q}</h3>
                    <p>{f.a}</p>
                  </div>
                ))}
              </section>
            )}

            {post.tags.length > 0 && (
              <p className="post-meta" style={{ marginTop: 40 }}>
                {post.tags.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </p>
            )}
          </div>
        </article>
      </main>
      <SiteFooter />
      <JsonLd
        data={[
          articleLd(post, author, ldImages),
          breadcrumbLd([
            { name: "홈", url: `${SITE_URL}/` },
            { name: "칼럼", url: `${SITE_URL}/blog/` },
            { name: post.title, url: postUrl(post.slug) },
          ]),
          ...(post.faq_json.length ? [faqLd(post)] : []),
        ]}
      />
    </>
  );
}
