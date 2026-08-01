import { successResponse, handleApiError } from '@/lib/api-response';
import { withAdminAuth } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';

export const GET = withAdminAuth(async (_request, _user) => {
  try {
    const [storage, topUsers] = await Promise.all([
      adminService.getStorageMetrics(),
      adminService.getTopUsers()
    ]);
    return successResponse({ storage, topUsersByStorage: topUsers });
  } catch (error) {
    return handleApiError(error);
  }
});
