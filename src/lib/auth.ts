import { cookies } from "next/headers";

// MVP-level admin auth: a single shared password (env ADMIN_PASSWORD) and a
// session cookie holding that same value. Good enough to gate an internal
// dashboard behind a password during early build-out. Before handing this
// to a real ops team, replace with per-user accounts (e.g. NextAuth /
// Clerk) so actions can be attributed to a named person, per the brand's
// "owned, not deflected" voice principle.

export const SESSION_COOKIE = "ma_admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "malogistics-admin";
}

export function isAdminAuthed(): boolean {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return !!token && token === getAdminPassword();
}
