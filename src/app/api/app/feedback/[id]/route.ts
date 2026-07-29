import feedbackService from '@/services/feedback.service';
import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';

export const DELETE = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const deletedFeedback = await feedbackService.deleteFeedback(user.userId, id);
    return successResponse(deletedFeedback);
  } catch (error) {
    return handleApiError(error);
  }
});
