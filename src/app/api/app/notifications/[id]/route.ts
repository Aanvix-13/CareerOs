import notificationService from '@/services/notification.service';
import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';

export const DELETE = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const deletedNotification = await notificationService.deleteNotification(user.userId, id);
    return successResponse(deletedNotification);
  } catch (error) {
    return handleApiError(error);
  }
});
