import { NextResponse } from "next/server";
import { resolveBackendUrl } from "./lib/backendUrl";

/**
 * Next.js 16 runtime proxy (replaces middleware.js from e7b77500).
 * Forwards /api/* and /auth/* to BACKEND_URL at request time so Docker
 * production does not bake http://localhost:8080 from next.config rewrites.
 */
export function proxy(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
    const target = new URL(pathname + search, resolveBackendUrl());
    return NextResponse.rewrite(target);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/api/:path*"],
};
