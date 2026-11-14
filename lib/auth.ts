import "server-only";
import { cookies, headers } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { sql } from "./db";
import { SESSION_COOKIE, SESSION_HOURS, verifySessionValue } from "./session";

export { SESSION_COOKIE, makeSessionValue } from "./session";

const MAX_FAILS = 5;
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
  return (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
}

export async function tooManyAttempts(ip: string): Promise<boolean> {
  const rows = (await sql()`
    SELECT count(*)::int AS n FROM login_attempts
    WHERE ip = ${ip} AND succeeded = false
      AND created_at > now() - make_interval(mins => ${WINDOW_MINUTES}::int)`) as { n: number }[];
  return (rows[0]?.n ?? 0) >= MAX_FAILS;
}

export async function recordAttempt(ip: string, succeeded: boolean): Promise<void> {
  await sql()`INSERT INTO login_attempts (ip, succeeded) VALUES (${ip}, ${succeeded})`;
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
