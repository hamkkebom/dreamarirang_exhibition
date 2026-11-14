# dreamarirang.com — 제1회 헐버트 유물전

아리랑 최초의 서양식 악보(1896년 헐버트 채보) 이야기, 제1회 헐버트 유물전 기록, 아리랑 칼럼.

- Next.js (App Router, TypeScript, Tailwind CSS) — 화면과 서버 동작을 모두 여기서 만든다
- Neon (PostgreSQL, 싱가포르 `sin1`) — Vercel 통합으로 연결, 함수 리전도 `sin1` (`vercel.json`)
- Vercel — GitHub `main`에 올리면 운영 배포, 다른 브랜치는 미리보기 배포

## 주소

| 주소 | 내용 |
|---|---|
| `/`, `/en/` | 첫 화면 (한국어·영어). 글은 `content/home.tsx` 한 파일에서 두 언어를 함께 고친다 |
| `/blog/`, `/blog/[slug]/` | 칼럼 목록·글 |
| `/authors/[slug]/` | 작성자 소개 (`lib/site.ts`의 `AUTHORS`) |
| `/admin/` | 칼럼 관리 (검색 제외) |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/og/[slug]/` | 검색용 |

## 로컬 실행

```bash
npm install
vercel env pull .env.local
npm run dev
```

## DB 표 바꾸기

`migrations/`에 새 번호의 SQL 파일을 추가하고 `npm run migrate`. 이미 적용한 파일은 고치지 않는다.
운영 DB의 표를 바꾸기 전에는 Neon에서 백업(브랜치)을 먼저 만든다.

## 환경 변수

이름은 `.env.example` 참고. 값은 Vercel 환경 변수에만 둔다.
