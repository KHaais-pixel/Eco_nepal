import "server-only";

import { cookies } from "next/headers";
import { readSession, SESSION_COOKIE, SESSION_TTL_SECONDS, signSession } from "./session-token";

export async function createSession() {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const token = await signSession({ role: "admin", expiresAt });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function getSession() {
  const store = await cookies();
  return readSession(store.get(SESSION_COOKIE)?.value);
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** True when the three required admin env vars are present and usable. */
export function isAuthConfigured() {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD_HASH?.startsWith("scrypt:") &&
      (process.env.SESSION_SECRET?.length ?? 0) >= 32
  );
}
