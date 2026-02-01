import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPrivateRoute =
    pathname.startsWith('/profile') || pathname.startsWith('/notes');

  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}
