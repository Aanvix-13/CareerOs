import applicationService from '@/services/application.service';
import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';

export const GET = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const history = await applicationService.getStatusHistory(user.userId, id);
    return successResponse(history);
  } catch (error) {
    return handleApiError(error);
  }
});
