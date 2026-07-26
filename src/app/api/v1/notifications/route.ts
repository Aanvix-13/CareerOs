import notificationService from '@/services/notification.service';
import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';
import { getPaginationParams, formatPaginatedResult } from '@/utils/pagination';
import { NotificationStatus } from '@prisma/client';

export const GET = withAuth(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const pagination = getPaginationParams(searchParams);
    const status = searchParams.get('status') as NotificationStatus || undefined;

    const { notifications, total } = await notificationService.getNotifications(user.userId, {
      status,
      skip: pagination.skip,
      limit: pagination.limit,
    });

    return successResponse(formatPaginatedResult(notifications, total, pagination.page, pagination.limit));
  } catch (error) {
    return handleApiError(error);
  }
});

export const PATCH = withAuth(async (request, user) => {
  try {
    const count = await notificationService.markAllNotificationsRead(user.userId);
    return successResponse({ count, message: 'All notifications marked as read.' });
  } catch (error) {
    return handleApiError(error);
  }
});
