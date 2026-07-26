import authService from '@/services/auth.service';
import { registerSchema } from '@/validators/auth';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      throw new ValidationError('Validation failed.', result.error.flatten().fieldErrors);
    }

    const { user } = await authService.register(
      result.data.email,
      result.data.password,
      result.data.fullName
    );

    return successResponse({ userId: user.id, email: user.email }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
