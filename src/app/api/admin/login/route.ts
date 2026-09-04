import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, findAdminByPassword, createSessionValue } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  const match = findAdminByPassword(password);
  if (!match) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, name: match.name });
  res.cookies.set(SESSION_COOKIE, createSessionValue(match.name, match.password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
