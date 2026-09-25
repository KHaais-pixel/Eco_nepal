import { NextResponse, type NextRequest } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/auth/session-token";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/config";

// Admin: optimistic check only, bouncing signed-out visitors to the login
// page early. The real authorisation happens in verifyAdmin() inside every
// admin page and server action (see src/lib/auth/dal.ts).
async function adminProxy(request: NextRequest) {
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

// Public site: pages live under app/[lang]. English keeps its clean URLs
// (/about is served by /en/about via an internal rewrite); Nepali is
// addressed explicitly as /ne/about.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return adminProxy(request);

  const first = pathname.split("/")[1];
  if (first === DEFAULT_LOCALE) {
    // /en/about → /about (one canonical URL per English page)
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(`/${DEFAULT_LOCALE}`.length) || "/";
    return NextResponse.redirect(url, 308);
  }
  if ((LOCALES as readonly string[]).includes(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except Next internals, uploads, and files with an extension
  // (images, PDFs, robots.txt, sitemap.xml, favicons).
  matcher: ["/((?!_next/|uploads/|.*\\..*).*)"],
};
