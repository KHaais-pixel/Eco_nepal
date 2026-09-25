import { jwtVerify, SignJWT } from "jose";

// Kept free of `next/headers` so the proxy can use it too.
export const SESSION_COOKIE = "eco_admin_session";
export const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

export type SessionPayload = { role: "admin"; expiresAt: number };

function key() {
  const secret = process.env.SESSION_SECRET;
  // A short or missing secret would make sessions forgeable, so refuse.
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const k = key();
  if (!k) throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(k);
}

export async function readSession(token: string | undefined): Promise<SessionPayload | null> {
  const k = key();
  if (!k || !token) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, k, { algorithms: ["HS256"] });
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}
