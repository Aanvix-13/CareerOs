import { withAdmin } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';
import { successResponse, handleApiError } from '@/lib/api-response';

export const PATCH = withAdmin(async (request, user, { params }: { params: Promise<{ userId: string }> }) => {
  try {
    const { userId } = await params;
    const updatedUser = await adminService.activateUser(user.userId, userId);
    return successResponse(updatedUser);
  } catch (error) {
    return handleApiError(error);
  }
});
