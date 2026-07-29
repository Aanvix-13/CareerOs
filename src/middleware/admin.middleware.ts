import { getCurrentUser } from '../lib/auth';
import { AppError, AuthError } from '../lib/errors';
import { errorResponse } from '../lib/api-response';

export type AuthenticatedHandler = (
  request: Request,
  user: { userId: string; email: string },
  context?: any
) => Promise<Response>;

export function withAdmin(handler: AuthenticatedHandler) {
  return async (request: Request, context?: any) => {
    try {
      // 1. Verify user session / auth token and get role
      const user = await getCurrentUser(request);

      if (user.role !== 'admin') {
        return errorResponse('FORBIDDEN', 'Access forbidden. Administrator role required.', null, 403);
      }

      return await handler(request, user, context);
    } catch (error: any) {
      if (error instanceof AppError) {
        return errorResponse(error.code, error.message, (error as any).details, error.statusCode);
      }
      return errorResponse('AUTH_REQUIRED', error.message || 'Authentication required.', null, 401);
    }
  };
}
