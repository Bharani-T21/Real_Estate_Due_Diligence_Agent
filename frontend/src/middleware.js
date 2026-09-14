import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/auth') || pathname.startsWith('/api')) {
    let backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    if (backendUrl && !backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
      if (!backendUrl.includes('.')) {
        backendUrl = 'https://' + backendUrl + '.onrender.com';
      } else {
        backendUrl = 'https://' + backendUrl;
      }
    }
    const target = new URL(pathname + search, backendUrl);
    return NextResponse.rewrite(target);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/api/:path*'],
};
