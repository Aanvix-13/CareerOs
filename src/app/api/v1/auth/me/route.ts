import authService from '@/services/auth.service';
import profileService from '@/services/profile.service';
import { changePasswordSchema } from '@/validators/auth';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth.middleware';

export const GET = withAuth(async (request, user) => {
  try {
    const profile = await profileService.getProfile(user.userId);
    return successResponse({
      id: user.userId,
      email: user.email,
      profile,
    });
  } catch (error) {
    return handleApiError(error);
  }
});

export const PUT = withAuth(async (request, user) => {
  try {
    const body = await request.json();
    const result = changePasswordSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed.', result.error.flatten().fieldErrors);
    }

    await authService.changePassword(
      result.data.newPassword
    );

    return successResponse({ message: 'Password changed successfully.' });
  } catch (error) {
    return handleApiError(error);
  }
});
