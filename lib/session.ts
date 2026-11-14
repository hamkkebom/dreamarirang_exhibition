// 서명한 세션 값 만들기·확인. proxy와 서버 동작이 함께 쓴다 (Node 런타임).
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "da_admin";
export const SESSION_HOURS = 12;

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("ADMIN_SESSION_SECRET is missing or too short");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function makeSessionValue(now = Date.now()): string {
  const exp = now + SESSION_HOURS * 3600 * 1000;
  const payload = `v1.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionValue(value: string | undefined, now = Date.now()): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || exp < now) return false;
  try {
    return safeEqual(parts[2], sign(`${parts[0]}.${parts[1]}`));
  } catch {
    return false;
  }
}
