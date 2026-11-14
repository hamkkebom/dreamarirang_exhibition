// /admin 으로 들어오는 요청 중 로그인하지 않은 것은 로그인 화면으로 돌려보낸다.
// 이것은 1차 관문일 뿐이고, 관리자 화면과 서버 동작은 각자 서버에서 다시 인증을 확인한다.
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionValue } from "@/lib/session";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // 깨진 퍼센트 인코딩 주소는 Next가 500을 내므로 여기서 404로 돌려보낸다
  try {
    decodeURIComponent(pathname);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  if (!verifySessionValue(req.cookies.get(SESSION_COOKIE)?.value)) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login/";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*", "/blog/:path*", "/og/:path*", "/authors/:path*"] };
