import { NextResponse } from "next/server";
import { resolveBackendUrl } from "./lib/backendUrl";

/**
 * Next.js runtime proxy middleware.
 * Forwards /api/* and /auth/* to BACKEND_URL at request time so Docker
 * production does not bake http://localhost:8080 from next.config rewrites.
 */
export function middleware(request) {
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
