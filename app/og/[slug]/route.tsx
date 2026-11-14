import { ImageResponse } from "next/og";
import { getPublishedPost } from "@/lib/posts";
import { SITE_NAME } from "@/lib/site";
import { safeSlug } from "@/lib/format";

const size = { width: 1200, height: 630 };
export const dynamic = "force-dynamic";

// 필요한 글자만 담은 한글 글꼴을 Google Fonts에서 받아 온다.
async function loadFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(safeSlug(slug));
  if (!post) return new Response("Not found", { status: 404 });
  const title = post.title;
  const category = post.category || "아리랑 칼럼";
  const footer = `${SITE_NAME} · dreamarirang.com`;
  const font = await loadFont(title + category + footer);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F9F8F2",
          padding: "72px 80px",
          fontFamily: font ? "Noto Serif KR" : "serif",
          borderTop: "16px solid #8B4513",
        }}
      >
        <div style={{ fontSize: 30, color: "#8B4513", display: "flex" }}>{category}</div>
        <div style={{ fontSize: title.length > 40 ? 52 : 64, color: "#1B1F3B", lineHeight: 1.35, display: "flex" }}>{title}</div>
        <div style={{ fontSize: 26, color: "#6b6b6b", display: "flex" }}>{footer}</div>
      </div>
    ),
    {
      ...size,
      // 제목을 고치거나 발행을 취소하면 5분 안에 반영되도록 짧게 캐시한다
      headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
      fonts: font ? [{ name: "Noto Serif KR", data: font, weight: 700, style: "normal" }] : [] },
  );
}
