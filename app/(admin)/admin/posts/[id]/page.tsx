import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { adminGetPost } from "@/lib/posts";
import { AUTHORS } from "@/lib/site";
import Editor from "../Editor";

export const dynamic = "force-dynamic";

export default async function EditPost({ params }: PageProps<"/admin/posts/[id]">) {
  if (!(await isAdmin())) redirect("/admin/login/");
  const { id } = await params;
  const n = Number(id);
  if (!Number.isInteger(n)) notFound();
  const p = await adminGetPost(n);
  if (!p) notFound();
  return (
    <Editor
      authors={AUTHORS.map((a) => a.name)}
      initial={{
        id: p.id,
        status: p.status,
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        content_mdx: p.content_mdx,
        category: p.category,
        tags: p.tags.join(", "),
        author_name: p.author_name,
        faq: p.faq_json,
        published_at: p.published_at?.toISOString() ?? null,
        updated_at: p.updated_at.toISOString(),
      }}
    />
  );
}
