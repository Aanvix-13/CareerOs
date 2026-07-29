import { withAdmin } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';
import { successResponse, handleApiError } from '@/lib/api-response';

export const GET = withAdmin(async (request, user, { params }: { params: Promise<{ userId: string }> }) => {
  try {
    const { userId } = await params;
    const details = await adminService.getUserDetails(userId);
    return successResponse(details);
  } catch (error) {
    return handleApiError(error);
  }
});

export const DELETE = withAdmin(async (request, user, { params }: { params: Promise<{ userId: string }> }) => {
  try {
    const { userId } = await params;
    const deletedUser = await adminService.deleteUser(user.userId, userId);
    return successResponse(deletedUser);
  } catch (error) {
    return handleApiError(error);
  }
});
