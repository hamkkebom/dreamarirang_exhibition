import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { DEFAULT_AUTHOR, AUTHORS } from "@/lib/site";
import Editor from "../Editor";

export const dynamic = "force-dynamic";

export default async function NewPost() {
  if (!(await isAdmin())) redirect("/admin/login/");
  return (
    <Editor
      authors={AUTHORS.map((a) => a.name)}
      initial={{
        id: null,
        status: "draft",
        slug: "",
        title: "",
        summary: "",
        content_mdx: "",
        category: "",
        tags: "",
        author_name: DEFAULT_AUTHOR.name,
        faq: [],
        published_at: null,
        updated_at: null,
      }}
    />
  );
}
