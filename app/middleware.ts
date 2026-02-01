import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session-token');
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPrivateRoute =
    pathname.startsWith('/profile') || pathname.startsWith('/notes');

  if (isPrivateRoute && !sessionToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
