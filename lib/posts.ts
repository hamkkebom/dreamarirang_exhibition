import "server-only";
import { sql } from "./db";

export type Faq = { q: string; a: string };

export type Post = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content_mdx: string;
  category: string;
  tags: string[];
  author_name: string;
  faq_json: Faq[];
  status: "draft" | "published";
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type PostListItem = Pick<
  Post,
  "id" | "slug" | "title" | "summary" | "category" | "tags" | "author_name" | "status" | "published_at" | "updated_at"
>;

type Row = Record<string, unknown>;

function toPost(r: Row): Post {
  return {
    id: Number(r.id),
    slug: String(r.slug),
    title: String(r.title),
    summary: String(r.summary ?? ""),
    content_mdx: String(r.content_mdx ?? ""),
    category: String(r.category ?? ""),
    tags: (r.tags as string[]) ?? [],
    author_name: String(r.author_name ?? ""),
    faq_json: Array.isArray(r.faq_json) ? (r.faq_json as Faq[]) : [],
    status: r.status === "published" ? "published" : "draft",
    published_at: r.published_at ? new Date(r.published_at as string) : null,
    created_at: new Date(r.created_at as string),
    updated_at: new Date(r.updated_at as string),
  };
}

// ---------- 공개 화면용: 발행된 글만 ----------

export async function getPublishedPosts(): Promise<PostListItem[]> {
  const rows = (await sql()`
    SELECT id, slug, title, summary, category, tags, author_name, status, published_at, updated_at, created_at
    FROM posts WHERE status = 'published'
    ORDER BY published_at DESC, id DESC`) as Row[];
  return rows.map(toPost);
}

export async function getPublishedPost(slug: string): Promise<Post | null> {
  const rows = (await sql()`
    SELECT * FROM posts WHERE slug = ${slug} AND status = 'published' LIMIT 1`) as Row[];
  return rows[0] ? toPost(rows[0]) : null;
}

export async function getPublishedPostsByAuthor(name: string): Promise<PostListItem[]> {
  const rows = (await sql()`
    SELECT id, slug, title, summary, category, tags, author_name, status, published_at, updated_at, created_at
    FROM posts WHERE status = 'published' AND author_name = ${name}
    ORDER BY published_at DESC, id DESC`) as Row[];
  return rows.map(toPost);
}

// ---------- 관리자용: 호출하는 쪽에서 반드시 인증을 확인한다 ----------

export async function adminListPosts(): Promise<PostListItem[]> {
  const rows = (await sql()`
    SELECT id, slug, title, summary, category, tags, author_name, status, published_at, updated_at, created_at
    FROM posts ORDER BY updated_at DESC, id DESC`) as Row[];
  return rows.map(toPost);
}

export async function adminGetPost(id: number): Promise<Post | null> {
  const rows = (await sql()`SELECT * FROM posts WHERE id = ${id} LIMIT 1`) as Row[];
  return rows[0] ? toPost(rows[0]) : null;
}

export type PostInput = {
  slug: string;
  title: string;
  summary: string;
  content_mdx: string;
  category: string;
  tags: string[];
  author_name: string;
  faq_json: Faq[];
};

export async function adminCreatePost(input: PostInput, status: "draft" | "published"): Promise<Post> {
  const rows = (await sql()`
    INSERT INTO posts (slug, title, summary, content_mdx, category, tags, author_name, faq_json, status)
    VALUES (${input.slug}, ${input.title}, ${input.summary}, ${input.content_mdx}, ${input.category},
            ${input.tags}, ${input.author_name}, ${JSON.stringify(input.faq_json)}::jsonb, ${status})
    RETURNING *`) as Row[];
  return toPost(rows[0]);
}

export async function adminUpdatePost(
  id: number,
  input: PostInput,
  newStatus: "draft" | "published",
  keepStatus = false,
): Promise<{ before: Post; after: Post } | null> {
  const before = await adminGetPost(id);
  if (!before) return null;
  const status = keepStatus ? before.status : newStatus;
  const rows = (await sql()`
    UPDATE posts SET slug = ${input.slug}, title = ${input.title}, summary = ${input.summary},
      content_mdx = ${input.content_mdx}, category = ${input.category}, tags = ${input.tags},
      author_name = ${input.author_name}, faq_json = ${JSON.stringify(input.faq_json)}::jsonb, status = ${status}
    WHERE id = ${id} RETURNING *`) as Row[];
  return { before, after: toPost(rows[0]) };
}

export async function adminSetStatus(id: number, status: "draft" | "published"): Promise<Post | null> {
  const rows = (await sql()`UPDATE posts SET status = ${status} WHERE id = ${id} RETURNING *`) as Row[];
  return rows[0] ? toPost(rows[0]) : null;
}

export async function adminDeletePost(id: number): Promise<Post | null> {
  const rows = (await sql()`DELETE FROM posts WHERE id = ${id} RETURNING *`) as Row[];
  return rows[0] ? toPost(rows[0]) : null;
}

export async function slugTaken(slug: string, exceptId?: number): Promise<boolean> {
  const rows = (await sql()`
    SELECT 1 FROM posts WHERE slug = ${slug} AND id <> ${exceptId ?? -1} LIMIT 1`) as Row[];
  return rows.length > 0;
}
