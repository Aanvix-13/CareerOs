import authService from '@/services/auth.service';
import { loginSchema } from '@/validators/auth';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      throw new ValidationError('Validation failed.', result.error.flatten().fieldErrors);
    }

    const { user } = await authService.login(
      result.data.email,
      result.data.password
    );

    return successResponse({ userId: user.id, email: user.email });
  } catch (error) {
    return handleApiError(error);
  }
}
