import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedHandler } from './auth.middleware';
import { TokenPayload } from '../lib/auth';

const ADMIN_ROLES = ['Admin', 'admin', 'Developer', 'developer'];

/**
 * Wraps a route handler with Clerk session + Admin/Developer role guard.
 * Returns 403 immediately for any user not in ADMIN_ROLES.
 */
export function withAdminAuth(handler: AuthenticatedHandler) {
  return withAuth(async (request: Request, user: TokenPayload, context?: any) => {
    if (!ADMIN_ROLES.includes(user.role ?? '')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Forbidden: Admin or Developer access is required.'
          }
        },
        { status: 403 }
      );
    }
    return handler(request, user, context);
  });
}

// Alias used by existing admin_careeros routes
export const withAdmin = withAdminAuth;
