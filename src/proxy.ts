import { NextResponse, type NextRequest } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/auth/session-token";

// Optimistic check only: bounce signed-out visitors to the login page early.
// The real authorisation happens in verifyAdmin() inside every admin page and
// server action (see src/lib/auth/dal.ts).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);

  let response: NextResponse;
  if (!session && !isLogin) {
    response = NextResponse.redirect(new URL("/admin/login", request.url));
  } else if (session && isLogin) {
    response = NextResponse.redirect(new URL("/admin", request.url));
  } else {
    response = NextResponse.next();
  }
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
