import reminderService from '@/services/reminder.service';
import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';

export const PATCH = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const reminder = await reminderService.markCompleted(user.userId, id);
    return successResponse(reminder);
  } catch (error) {
    return handleApiError(error);
  }
});
