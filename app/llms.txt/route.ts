import { getPublishedPosts } from "@/lib/posts";
import { SITE_URL, SITE_NAME } from "@/lib/site";

// 발행·수정이 바로 보이도록 요청 때마다 DB에서 만든다 (작고 가벼운 응답)
export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await getPublishedPosts();
  const lines = [
    `# ${SITE_NAME}`,
    "",
    "> 아리랑 최초의 서양식 악보(1896년 호머 헐버트 채보) 이야기와, 채보 130주년을 기념한 제1회 헐버트 유물전(2026년 3월 19일~4월 19일, 서울 함께봄 서촌 한옥, 종료)의 기록. 운영: 함께봄 주식회사.",
    "",
    "## 주요 화면",
    "",
    `- [아리랑과 제1회 헐버트 유물전 (한국어)](${SITE_URL}/)`,
    `- [Arirang and the 1st Hulbert Relics Exhibition (English)](${SITE_URL}/en/)`,
    `- [아리랑 칼럼 목록](${SITE_URL}/blog/)`,
    "",
    "## 칼럼",
    "",
    ...(posts.length
      ? posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}/)${p.summary ? `: ${p.summary.replace(/\s+/g, " ")}` : ""}`)
      : ["- 아직 발행된 칼럼이 없습니다."]),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
