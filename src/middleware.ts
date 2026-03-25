// src/middleware.ts
// Runs at the Edge on every request BEFORE the page renders.
// Reads the access token from a short-lived cookie set at login,
// verifies it, and redirects unauthenticated / unauthorised users.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that don't need authentication
const PUBLIC_PATHS = ["/auth/login", "/auth/register","/dashboard", "/", "/api/"];

// Paths restricted to admins only
const ADMIN_PATHS = ["/admin"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  // The frontend stores a short-lived (15 min) access token in a
  // client-readable cookie purely for SSR/middleware reads.
  // The real security lives in the httpOnly refresh cookie on the backend.
  const accessToken = request.cookies.get("dingly_access")?.value;

  if (!accessToken) {
    return redirectToLogin(request);
  }

  // Decode the JWT payload WITHOUT verifying signature —
  // full verification happens on the backend on every API call.
  // This is intentional: the Edge runtime can't easily load the
  // secret, and the backend is the authoritative trust boundary.
  try {
    const [, payloadB64] = accessToken.split(".");
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );

    // Check expiry
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return redirectToLogin(request);
    }

    // Admin guard
    if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Forward user info to pages via headers
    const headers = new Headers(request.headers);
    headers.set("x-user-id",    payload.userId);
    headers.set("x-user-email", payload.email);
    headers.set("x-user-role",  payload.role);

    return NextResponse.next({ request: { headers } });
  } catch {
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set("from", request.nextUrl.pathname);
  const res = NextResponse.redirect(url);
  res.cookies.delete("dingly_access");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts|images).*)"],
};