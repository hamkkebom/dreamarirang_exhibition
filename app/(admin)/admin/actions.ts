"use server";
// 관리자용 서버 동작. 모든 동작은 첫 줄에서 requireAdmin()으로 다시 인증을 확인한다.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  requireAdmin,
  UnauthorizedError,
  passwordMatches,
  clientIp,
  beginAttempt,
  markAttemptSucceeded,
  makeSessionValue,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  LIMIT_TEXT,
} from "@/lib/auth";
import {
  adminCreatePost,
  adminUpdatePost,
  adminSetStatus,
  adminDeletePost,
  slugTaken,
  type PostInput,
  type Faq,
} from "@/lib/posts";
import { renderMarkdown, type Rendered } from "@/lib/markdown";
import { authorByName, AUTHORS } from "@/lib/site";

// ---------- 로그인 ----------

export async function login(_: { error?: string } | undefined, form: FormData): Promise<{ error?: string }> {
  const ip = await clientIp();
  const attempt = await beginAttempt(ip);
  if (attempt === null) {
    return { error: `로그인 실패가 ${LIMIT_TEXT}을 넘었습니다. 잠시 뒤에 다시 시도해 주세요.` };
  }
  if (!passwordMatches(String(form.get("password") ?? ""))) return { error: "비밀번호가 맞지 않습니다." };
  await markAttemptSucceeded(attempt);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, makeSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin/");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login/");
}

// ---------- 글 저장 ----------

export type SaveResult = { ok: true; id: number; status: "draft" | "published" } | { ok: false; error: string };

type Draft = {
  slug: string;
  title: string;
  summary: string;
  content_mdx: string;
  category: string;
  tags: string;
  author_name: string;
  faq: Faq[];
};

function clean(d: Draft): PostInput | string {
  const slug = d.slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length > 120)
    return "주소(slug)는 영문 소문자, 숫자, 하이픈(-)만 쓸 수 있습니다. 예: hulbert-arirang-1896";
  const title = d.title.trim();
  if (!title || title.length > 200) return "제목을 1~200자로 적어 주세요.";
  const author_name = d.author_name.trim() || AUTHORS[0].name;
  if (!authorByName(author_name))
    return `작성자는 소개 화면이 있는 이름만 쓸 수 있습니다: ${AUTHORS.map((a) => a.name).join(", ")}`;
  const faq_json = (Array.isArray(d.faq) ? d.faq : [])
    .map((f) => ({ q: String(f?.q ?? "").trim(), a: String(f?.a ?? "").trim() }))
    .filter((f) => f.q || f.a);
  if (faq_json.some((f) => !f.q || !f.a)) return "FAQ 항목은 질문과 답을 모두 적어 주세요.";
  return {
    slug,
    title,
    summary: d.summary.trim().slice(0, 500),
    content_mdx: d.content_mdx,
    category: d.category.trim().slice(0, 60),
    tags: d.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 20),
    author_name,
    faq_json,
  };
}

function refreshPublic(...slugs: (string | undefined)[]) {
  revalidatePath("/");
  revalidatePath("/blog/");
  for (const s of new Set(slugs.filter(Boolean))) revalidatePath(`/blog/${s}/`);
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/authors/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
}

export async function savePost(id: number | null, draft: Draft, intent: "draft" | "publish" | "keep"): Promise<SaveResult> {
  try {
    await requireAdmin();
    const input = clean(draft);
    if (typeof input === "string") return { ok: false, error: input };
    if (await slugTaken(input.slug, id ?? undefined)) return { ok: false, error: "이미 쓰고 있는 주소(slug)입니다." };

    if (id === null) {
      const status = intent === "publish" ? "published" : "draft";
      const post = await adminCreatePost(input, status);
      if (status === "published") refreshPublic(post.slug);
      return { ok: true, id: post.id, status };
    }

    const current = intent === "keep" ? null : intent === "publish" ? "published" : "draft";
    const res = await adminUpdatePost(id, input, current ?? "draft", current === null);
    if (!res) return { ok: false, error: "글을 찾을 수 없습니다." };
    if (res.before.status === "published" || res.after.status === "published") refreshPublic(res.before.slug, res.after.slug);
    return { ok: true, id, status: res.after.status };
  } catch (e) {
    if (e instanceof UnauthorizedError) return { ok: false, error: "로그인이 필요합니다." };
    console.error(e);
    return { ok: false, error: "저장하지 못했습니다. 잠시 뒤에 다시 시도해 주세요." };
  }
}

export async function unpublishPost(id: number): Promise<SaveResult> {
  try {
    await requireAdmin();
    const post = await adminSetStatus(id, "draft");
    if (!post) return { ok: false, error: "글을 찾을 수 없습니다." };
    refreshPublic(post.slug);
    return { ok: true, id, status: "draft" };
  } catch (e) {
    if (e instanceof UnauthorizedError) return { ok: false, error: "로그인이 필요합니다." };
    console.error(e);
    return { ok: false, error: "발행을 취소하지 못했습니다." };
  }
}

export async function deletePost(id: number): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
    const post = await adminDeletePost(id);
    if (!post) return { ok: false, error: "글을 찾을 수 없습니다." };
    if (post.status === "published") refreshPublic(post.slug);
    return { ok: true };
  } catch (e) {
    if (e instanceof UnauthorizedError) return { ok: false, error: "로그인이 필요합니다." };
    console.error(e);
    return { ok: false, error: "삭제하지 못했습니다." };
  }
}

export async function previewMarkdown(source: string): Promise<Rendered | { error: string }> {
  try {
    await requireAdmin();
    return await renderMarkdown(source.slice(0, 200_000));
  } catch (e) {
    if (e instanceof UnauthorizedError) return { error: "로그인이 필요합니다." };
    return { error: "미리보기를 만들지 못했습니다." };
  }
}
