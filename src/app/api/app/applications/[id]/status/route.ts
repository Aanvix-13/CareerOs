import applicationService from '@/services/application.service';
import { updateStatusSchema } from '@/validators/application';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth.middleware';

export const PATCH = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateStatusSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed.', result.error.flatten().fieldErrors);
    }

    const updatedApp = await applicationService.updateStatus(
      user.userId,
      id,
      result.data.status,
      result.data.notes
    );

    return successResponse(updatedApp);
  } catch (error) {
    return handleApiError(error);
  }
});
