import { withAdmin } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';
import { successResponse, handleApiError } from '@/lib/api-response';

export const GET = withAdmin(async (request, user, { params }: { params: Promise<{ feedbackId: string }> }) => {
  try {
    const { feedbackId } = await params;
    const details = await adminService.getFeedbackById(feedbackId);
    return successResponse(details);
  } catch (error) {
    return handleApiError(error);
  }
});

export const PATCH = withAdmin(async (request, user, { params }: { params: Promise<{ feedbackId: string }> }) => {
  try {
    const { feedbackId } = await params;
    const body = await request.json();
    const { status, adminNotes } = body;

    const updatedFeedback = await adminService.updateFeedbackStatus(
      user.userId,
      feedbackId,
      status,
      adminNotes
    );

    return successResponse(updatedFeedback);
  } catch (error) {
    return handleApiError(error);
  }
});

export const DELETE = withAdmin(async (request, user, { params }: { params: Promise<{ feedbackId: string }> }) => {
  try {
    const { feedbackId } = await params;
    const deletedFeedback = await adminService.deleteFeedback(user.userId, feedbackId);
    return successResponse(deletedFeedback);
  } catch (error) {
    return handleApiError(error);
  }
});
