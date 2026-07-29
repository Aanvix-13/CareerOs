import notificationService from '@/services/notification.service';
import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';

export const PATCH = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const notification = await notificationService.markNotificationRead(user.userId, id);
    return successResponse(notification);
  } catch (error) {
    return handleApiError(error);
  }
});
