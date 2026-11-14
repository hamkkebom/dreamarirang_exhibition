const fmt = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "long", day: "numeric" });

export function koDate(d: Date): string {
  return fmt.format(d);
}

/** 서울 기준 날짜(YYYY-MM-DD) */
export function seoulDay(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(d);
}
