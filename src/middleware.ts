import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "ma_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  const protectedPage = pathname.startsWith("/admin") && !isLoginPage;
  const protectedApi = pathname.startsWith("/api/admin") && !isLoginApi;

  if (!protectedPage && !protectedApi) return NextResponse.next();

  const cookieValue = req.cookies.get(SESSION_COOKIE)?.value;
  const expected = process.env.ADMIN_PASSWORD || "malogistics-admin";
  const authed = !!cookieValue && cookieValue === expected;

  if (authed) return NextResponse.next();

  if (protectedApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
