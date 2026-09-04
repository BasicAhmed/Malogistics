import { cookies } from "next/headers";

// Multi-admin auth via a single env var: ADMIN_USERS="Ahmed:pass1,Sarah:pass2"
// Each admin has their own name+password, so status changes can be
// attributed to a person (see StatusEvent.by) instead of one shared login.
// Falls back to a single "Admin" account from ADMIN_PASSWORD if ADMIN_USERS
// isn't set, so existing setups keep working.

export const SESSION_COOKIE = "ma_admin_session";

interface AdminUser {
  name: string;
  password: string;
}

export function getAdminUsers(): AdminUser[] {
  const raw = process.env.ADMIN_USERS;
  if (raw) {
    return raw
      .split(",")
      .map((pair) => {
        const [name, password] = pair.split(":").map((s) => s.trim());
        return { name, password };
      })
      .filter((u) => u.name && u.password);
  }
  return [{ name: "Admin", password: process.env.ADMIN_PASSWORD || "malogistics-admin" }];
}

export function findAdminByPassword(password: string): AdminUser | undefined {
  return getAdminUsers().find((u) => u.password === password);
}

function encodeSession(name: string, password: string): string {
  return `${name}::${password}`;
}

export function isValidSession(cookieValue: string | undefined): { valid: boolean; name?: string } {
  if (!cookieValue) return { valid: false };
  const [name, password] = cookieValue.split("::");
  const match = getAdminUsers().find((u) => u.name === name && u.password === password);
  return match ? { valid: true, name: match.name } : { valid: false };
}

export function createSessionValue(name: string, password: string): string {
  return encodeSession(name, password);
}

export function isAdminAuthed(): boolean {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return isValidSession(token).valid;
}

export function getAdminName(): string | undefined {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return isValidSession(token).name;
}
