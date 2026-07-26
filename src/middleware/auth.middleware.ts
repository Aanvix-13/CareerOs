import { getCurrentUser, TokenPayload } from '../lib/auth';
import { AppError } from '../lib/errors';
import { errorResponse } from '../lib/api-response';

export type AuthenticatedHandler = (
  request: Request,
  user: TokenPayload,
  context?: any
) => Promise<Response>;

export function withAuth(handler: AuthenticatedHandler) {
  return async (request: Request, context?: any) => {
    try {
      const user = await getCurrentUser(request);
      return await handler(request, user, context);
    } catch (error: any) {
      if (error instanceof AppError) {
        return errorResponse(error.code, error.message, (error as any).details, error.statusCode);
      }
      return errorResponse('AUTH_REQUIRED', error.message || 'Authentication required.', null, 401);
    }
  };
}
