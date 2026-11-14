import "server-only";
import { cookies, headers } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { sql } from "./db";
import { SESSION_COOKIE, SESSION_HOURS, verifySessionValue } from "./session";

export { SESSION_COOKIE, makeSessionValue } from "./session";

const MAX_FAILS = 5;
const MAX_FAILS_ALL = 30; // 모든 IP를 합친 상한
const WINDOW_MINUTES = 15;

/** 요청마다 서버에서 다시 확인한다. 관리자용 서버 동작과 화면은 모두 이 함수를 먼저 부른다. */
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionValue(jar.get(SESSION_COOKIE)?.value);
}

export class UnauthorizedError extends Error {
  constructor() {
    super("unauthorized");
  }
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new UnauthorizedError();
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  const ip = (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
  // IPv6는 한 사람이 /64 대역 전체를 쓸 수 있으므로 앞 4마디로 묶는다
  if (ip.includes(":")) return ip.split(":").slice(0, 4).join(":") + "::/64";
  return ip;
}

/**
 * 시도를 먼저 '실패'로 기록하고, 그 기록을 포함해 횟수를 센다.
 * 동시에 여러 요청을 보내도 기록이 먼저 쌓이므로 제한을 피할 수 없다.
 * 반환값: 기록 id (제한에 걸렸으면 null)
 */
export async function beginAttempt(ip: string): Promise<number | null> {
  const ins = (await sql()`
    INSERT INTO login_attempts (ip, succeeded) VALUES (${ip}, false) RETURNING id`) as { id: number }[];
  const rows = (await sql()`
    SELECT
      count(*) FILTER (WHERE ip = ${ip})::int AS mine,
      count(*)::int AS total
    FROM login_attempts
    WHERE succeeded = false AND created_at > now() - make_interval(mins => ${WINDOW_MINUTES}::int)`) as {
    mine: number;
    total: number;
  }[];
  const { mine = 0, total = 0 } = rows[0] ?? {};
  if (mine > MAX_FAILS || total > MAX_FAILS_ALL) return null;
  return Number(ins[0].id);
}

export async function markAttemptSucceeded(id: number): Promise<void> {
  await sql()`UPDATE login_attempts SET succeeded = true WHERE id = ${id}`;
  await sql()`DELETE FROM login_attempts WHERE created_at < now() - interval '7 days'`;
}

export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = createHmac("sha256", "pw").update(input).digest();
  const b = createHmac("sha256", "pw").update(expected).digest();
  return timingSafeEqual(a, b);
}

export const SESSION_MAX_AGE = SESSION_HOURS * 3600;
export const LIMIT_TEXT = `${WINDOW_MINUTES}분 동안 ${MAX_FAILS}번`;
