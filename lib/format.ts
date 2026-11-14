const fmt = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric" });

export function koDate(d: Date): string {
  return fmt.format(d);
}

/** 서울 기준 날짜(YYYY-MM-DD) */
export function seoulDay(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(d);
}

/** 주소의 slug를 검사한다. 칼럼 주소 형식이 아니면 빈 문자열(→ 404) */
export function safeSlug(raw: string): string {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(raw) ? raw : "";
}
