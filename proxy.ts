import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { PORTAL_SESSION_COOKIE, verifyPortalSessionToken } from "@/lib/portal-session";

// Static assets (images in /public, uploads, etc.) are requested directly by
// <img>/<a> tags with no session-aware handling — redirecting those to /login
// would just break them, so anything that looks like a file request passes through.
const STATIC_FILE_RE = /\.[a-zA-Z0-9]+$/;

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || STATIC_FILE_RE.test(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }

    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(token);

    if (!session?.userId) {
      return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/api") || pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(PORTAL_SESSION_COOKIE)?.value;
  const session = await verifyPortalSessionToken(token);

  if (!session?.portalUserId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
