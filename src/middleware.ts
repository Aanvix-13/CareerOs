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
  const { userId } = await auth();
  const isProtected = isProtectedRoute(req);

  if (isProtected && !userId) {
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

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
};
