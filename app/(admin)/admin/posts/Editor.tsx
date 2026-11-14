"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePost, unpublishPost, deletePost, previewMarkdown } from "../actions";
import type { Faq } from "@/lib/posts";

type Initial = {
  id: number | null;
  status: "draft" | "published";
  slug: string;
  title: string;
  summary: string;
  content_mdx: string;
  category: string;
  tags: string;
  author_name: string;
  faq: Faq[];
  published_at: string | null;
  updated_at: string | null;
};

const input = "w-full rounded-md border border-[#e8e4df] bg-white px-3 py-2 text-[15px]";
const label = "mb-1 block text-sm font-semibold text-[#6b6b6b]";
const btn = "rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-50";

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "long", timeStyle: "short" }).format(new Date(iso));
}

export default function Editor({ initial, authors }: { initial: Initial; authors: string[] }) {
  const router = useRouter();
  const [f, setF] = useState(initial);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const [preview, setPreview] = useState<{ html: string; warnings: string[]; toc: { depth: number; text: string }[] } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = <K extends keyof Initial>(k: K, v: Initial[K]) => setF((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      const r = await previewMarkdown(f.content_mdx);
      if ("error" in r) setMsg({ kind: "err", text: r.error });
      else setPreview({ html: r.html, warnings: r.warnings, toc: r.toc });
    }, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [f.content_mdx]);

  const draft = () => ({
    slug: f.slug,
    title: f.title,
    summary: f.summary,
    content_mdx: f.content_mdx,
    category: f.category,
    tags: f.tags,
    author_name: f.author_name,
    faq: f.faq,
  });

  const save = (intent: "draft" | "publish" | "keep") =>
    start(async () => {
      setMsg(null);
      const r = await savePost(f.id, draft(), intent);
      if (!r.ok) return setMsg({ kind: "err", text: r.error });
      const text =
        r.status === "published"
          ? intent === "publish" && f.status !== "published"
            ? "발행했습니다. 공개 화면과 사이트맵에 바로 반영됩니다."
            : "수정 내용을 공개 화면에 반영했습니다."
          : "임시저장했습니다. 공개 화면에는 나오지 않습니다.";
      setMsg({ kind: "ok", text });
      if (f.id === null) router.replace(`/admin/posts/${r.id}/`);
      else router.refresh();
      setF((s) => ({ ...s, id: r.id, status: r.status }));
    });

  const unpublish = () =>
    start(async () => {
      const r = await unpublishPost(f.id!);
      if (!r.ok) return setMsg({ kind: "err", text: r.error });
      setF((s) => ({ ...s, status: "draft" }));
      setMsg({ kind: "ok", text: "발행을 취소했습니다. 공개 화면과 사이트맵에서 빠집니다." });
      router.refresh();
    });

  const remove = () => {
    if (!confirm("이 글을 완전히 삭제할까요? 되돌릴 수 없습니다.")) return;
    start(async () => {
      const r = await deletePost(f.id!);
      if (!r.ok) return setMsg({ kind: "err", text: r.error ?? "삭제하지 못했습니다." });
      router.replace("/admin/");
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <a href="/admin/" className="text-sm text-[#8B4513]">
            ← 칼럼 목록
          </a>
          <h1 className="mt-1 text-2xl font-bold" style={{ fontFamily: "var(--font-serif)", color: "var(--color-primary)" }}>
            {f.id === null ? "새 글" : "글 수정"}{" "}
            <span className="align-middle text-sm font-normal text-[#999]">
              {f.status === "published" ? "· 발행됨" : "· 임시저장"}
            </span>
          </h1>
          {f.id !== null && (
            <p className="text-xs text-[#999]">
              처음 발행 {fmt(f.published_at)} · 마지막 수정 {fmt(f.updated_at)}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {f.status === "draft" ? (
            <>
              <button disabled={pending} onClick={() => save("draft")} className={`${btn} border border-[#e8e4df] bg-white`}>
                임시저장
              </button>
              <button disabled={pending} onClick={() => save("publish")} className={`${btn} bg-[#8B4513] text-white`}>
                발행
              </button>
            </>
          ) : (
            <>
              <button disabled={pending} onClick={() => save("keep")} className={`${btn} bg-[#8B4513] text-white`}>
                수정 내용 반영
              </button>
              <button disabled={pending} onClick={unpublish} className={`${btn} border border-[#e8e4df] bg-white`}>
                발행 취소
              </button>
              <a href={`/blog/${f.slug}/`} target="_blank" className={`${btn} border border-[#e8e4df] bg-white`}>
                공개 화면
              </a>
            </>
          )}
          {f.id !== null && (
            <button disabled={pending} onClick={remove} className={`${btn} border border-red-200 bg-white text-red-700`}>
              삭제
            </button>
          )}
        </div>
      </div>

      {msg && (
        <p role="status" className={`mb-4 rounded-md px-4 py-2 text-sm ${msg.kind === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {msg.text}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px]">
        {/* 입력 */}
        <div className="flex flex-col gap-4">
          <div>
            <label className={label} htmlFor="title">제목</label>
            <input id="title" className={input} value={f.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="slug">주소 (slug) — dreamarirang.com/blog/주소/</label>
            <input id="slug" className={input} value={f.slug} placeholder="hulbert-arirang-1896" onChange={(e) => set("slug", e.target.value)} />
            {f.status === "published" && <p className="mt-1 text-xs text-[#8B4513]">발행한 글의 주소를 바꾸면 옛 주소는 열리지 않습니다.</p>}
          </div>
          <div>
            <label className={label} htmlFor="summary">요약 (검색 결과 설명으로 쓰입니다, 120자 안팎)</label>
            <textarea id="summary" rows={3} className={input} value={f.summary} onChange={(e) => set("summary", e.target.value)} />
            <p className="mt-1 text-xs text-[#999]">{f.summary.length}자</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label} htmlFor="category">분류</label>
              <input id="category" className={input} value={f.category} onChange={(e) => set("category", e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="author">작성자</label>
              <select id="author" className={input} value={f.author_name} onChange={(e) => set("author_name", e.target.value)}>
                {authors.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={label} htmlFor="tags">태그 (쉼표로 구분)</label>
            <input id="tags" className={input} value={f.tags} onChange={(e) => set("tags", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="content">본문 (마크다운)</label>
            <textarea
              id="content"
              rows={24}
              className={`${input} font-mono text-[14px]`}
              value={f.content_mdx}
              onChange={(e) => set("content_mdx", e.target.value)}
            />
          </div>

          <fieldset className="rounded-md border border-[#e8e4df] bg-white p-4">
            <legend className="px-1 text-sm font-semibold text-[#6b6b6b]">자주 묻는 질문 (FAQ)</legend>
            {f.faq.length === 0 && <p className="text-sm text-[#999]">항목이 없습니다.</p>}
            {f.faq.map((item, i) => (
              <div key={i} className="mb-4 flex flex-col gap-2 border-b border-[#f0ece7] pb-4">
                <input
                  aria-label={`질문 ${i + 1}`}
                  placeholder="질문"
                  className={input}
                  value={item.q}
                  onChange={(e) => set("faq", f.faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))}
                />
                <textarea
                  aria-label={`답 ${i + 1}`}
                  placeholder="답"
                  rows={3}
                  className={input}
                  value={item.a}
                  onChange={(e) => set("faq", f.faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))}
                />
                <button type="button" className="self-start text-sm text-red-700" onClick={() => set("faq", f.faq.filter((_, j) => j !== i))}>
                  이 항목 삭제
                </button>
              </div>
            ))}
            <button type="button" className={`${btn} border border-[#e8e4df] bg-white`} onClick={() => set("faq", [...f.faq, { q: "", a: "" }])}>
              FAQ 항목 추가
            </button>
          </fieldset>
        </div>

        {/* 미리보기 */}
        <div>
          <p className={label}>미리보기</p>
          <div className="rounded-md border border-[#e8e4df] bg-white p-5">
            <h2 className="page-title" style={{ fontSize: 26 }}>{f.title || "제목"}</h2>
            {f.summary && <p className="page-lead mb-4">{f.summary}</p>}
            {preview && preview.toc.length > 1 && (
              <div className="toc" style={{ margin: "8px 0 20px" }}>
                <p className="mb-1 text-xs font-semibold text-[#999]">목차</p>
                <ol>
                  {preview.toc.map((t, i) => (
                    <li key={i} className={`toc-${t.depth}`}>{t.text}</li>
                  ))}
                </ol>
              </div>
            )}
            <div className="prose" dangerouslySetInnerHTML={{ __html: preview?.html ?? "" }} />
            {f.faq.some((x) => x.q) && (
              <div className="faq">
                <p className="mb-2 font-semibold">자주 묻는 질문</p>
                {f.faq.map((x, i) => (
                  <div className="faq-item" key={i}>
                    <h3>{x.q}</h3>
                    <p>{x.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {preview && preview.warnings.length > 0 && (
            <ul className="mt-3 list-disc pl-5 text-sm text-[#8B4513]">
              {preview.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
        </div>

        {/* 글쓰기 안내 */}
        <aside className="h-fit rounded-md border border-[#e8e4df] bg-[#FFFFFF] p-4 text-sm leading-relaxed text-[#1a1a1a] lg:sticky lg:top-6">
          <h2 className="mb-2 font-bold text-[#1B1F3B]">칼럼을 쓸 때의 규칙</h2>
          <p className="mb-3 text-xs text-[#6b6b6b]">AI 검색에 인용되는 데는 마크업보다 글의 내용이 더 크게 작용합니다.</p>
          <ol className="list-decimal space-y-2 pl-4">
            <li>첫 문단에서 질문의 답을 먼저 말합니다.</li>
            <li>수치, 연도, 이름 같은 확인할 수 있는 사실을 적고 출처를 밝힙니다.</li>
            <li>소제목(##, ###)은 그 아래 내용을 그대로 말해 주는 문장으로 씁니다.</li>
            <li>내용이 바뀌면 글을 고치고, 수정한 날이 드러나게 합니다. (수정 내용을 반영하면 ‘마지막 수정’ 날짜가 자동으로 바뀝니다.)</li>
          </ol>
          <h3 className="mb-1 mt-4 font-bold text-[#1B1F3B]">마크다운 쓰는 법</h3>
          <ul className="space-y-1 text-xs text-[#6b6b6b]">
            <li><code>## 소제목</code> · <code>### 작은 소제목</code> (목차가 자동으로 생깁니다)</li>
            <li><code>**굵게**</code> · <code>[링크](https://주소)</code></li>
            <li><code>![대체 글](이미지주소 &quot;800x450&quot;)</code> — 대체 글과 가로x세로 크기를 꼭 적습니다</li>
            <li>중요한 내용은 이미지가 아니라 글자로 적습니다.</li>
            <li>글 제목이 화면의 큰 제목(h1)이 되므로 본문에는 <code>#</code> 한 개짜리 제목을 쓰지 않습니다.</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
