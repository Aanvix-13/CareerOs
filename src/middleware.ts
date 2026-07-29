import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/app(.*)',
  '/admin_careeros(.*)',
]);

const isApiRoute = createRouteMatcher([
  '/api/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const isProtected = isProtectedRoute(req);

  // If the route is public (e.g. landing page /), pass through directly
  if (!isProtected) {
    return NextResponse.next();
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      if (isApiRoute(req)) {
        return NextResponse.json(
          { success: false, error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
          { status: 401 }
        );
      }
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  } catch (error) {
    console.error('Clerk Middleware Auth Error:', error);
    if (isApiRoute(req)) {
      return NextResponse.json(
        { success: false, error: { code: 'AUTH_ERROR', message: 'Authentication service unavailable.' } },
        { status: 500 }
      );
    }
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
