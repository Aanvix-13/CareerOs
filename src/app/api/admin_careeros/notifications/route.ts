import { withAdmin } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';
import { successResponse, handleApiError } from '@/lib/api-response';

export const GET = withAdmin(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || undefined;

    const result = await adminService.getNotificationHistory({
      page,
      limit,
      search,
    });

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});

export const POST = withAdmin(async (request: Request, user) => {
  try {
    const body = await request.json();
    const { title, message, audience, targetUserIds } = body;

    const result = await adminService.sendNotification(
      user.userId,
      title,
      message,
      audience,
      targetUserIds
    );

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});
