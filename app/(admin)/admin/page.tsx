import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { adminListPosts } from "@/lib/posts";
import { koDate } from "@/lib/format";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/login/");
  const posts = await adminListPosts();

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "var(--color-primary)" }}>
          칼럼 관리
        </h1>
        <div className="flex gap-2">
          <a href="/blog/" target="_blank" className="rounded-md border border-[#e8e4df] bg-white px-3 py-2 text-sm">
            공개 화면 보기
          </a>
          <a href="/admin/posts/new/" className="rounded-md bg-[#1B1F3B] px-3 py-2 text-sm font-semibold text-white">
            새 글
          </a>
          <form action={logout}>
            <button className="rounded-md border border-[#e8e4df] bg-white px-3 py-2 text-sm">로그아웃</button>
          </form>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="text-[#6b6b6b]">아직 글이 없습니다. ‘새 글’로 첫 칼럼을 써 보세요.</p>
      ) : (
        <table className="w-full border-collapse bg-white text-sm">
          <thead>
            <tr className="border-b border-[#e8e4df] text-left text-[#999]">
              <th className="p-3">제목</th>
              <th className="p-3">상태</th>
              <th className="p-3">처음 발행</th>
              <th className="p-3">마지막 수정</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-[#f0ece7]">
                <td className="p-3">
                  <a href={`/admin/posts/${p.id}/`} className="font-medium text-[#1B1F3B] underline-offset-2 hover:underline">
                    {p.title}
                  </a>
                  <div className="text-xs text-[#999]">/blog/{p.slug}/</div>
                </td>
                <td className="p-3">
                  {p.status === "published" ? (
                    <span className="rounded-full bg-[#8B4513] px-2 py-0.5 text-xs text-white">발행</span>
                  ) : (
                    <span className="rounded-full border border-[#e8e4df] px-2 py-0.5 text-xs text-[#6b6b6b]">임시저장</span>
                  )}
                </td>
                <td className="p-3 text-[#6b6b6b]">{p.published_at ? koDate(p.published_at) : "—"}</td>
                <td className="p-3 text-[#6b6b6b]">{koDate(p.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
