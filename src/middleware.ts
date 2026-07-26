import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  // Retrieve user session
  const { data: { user } } = await supabase.auth.getUser();

  // Paths starting with these prefixes require authentication
  const protectedPrefixes = [
    '/dashboard',
    '/profile',
    '/resumes',
    '/applications',
    '/interviews',
    '/reminders',
    '/analytics',
    '/feedback',
    '/settings',
  ];

  const isProtectedRoute = protectedPrefixes.some((path) => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/resumes/:path*',
    '/applications/:path*',
    '/interviews/:path*',
    '/reminders/:path*',
    '/analytics/:path*',
    '/feedback/:path*',
    '/settings/:path*',
  ],
};
