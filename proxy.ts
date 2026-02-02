import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!accessToken && refreshToken) {
    try {
      const response = await checkServerSession();
      const setCookieHeader = response.headers['set-cookie'];

      if (setCookieHeader) {
        const nextResponse = isPublicRoute
          ? NextResponse.redirect(new URL('/', request.url))
          : NextResponse.next();

        const cookieArray = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        cookieArray.forEach(cookieStr => {
          const parsed = parse(cookieStr);

          const cookieEntries = Object.entries(parsed);
          if (cookieEntries.length > 0) {
            const [name, value] = cookieEntries[0];

            if (name && value) {
              nextResponse.cookies.set(name, value, {
                path: parsed.Path || '/',
                maxAge: parsed['Max-Age']
                  ? Number(parsed['Max-Age'])
                  : undefined,
                expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
              });
            }
          }
        });

        return nextResponse;
      }
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  }

  if (isPrivateRoute && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicRoute && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
