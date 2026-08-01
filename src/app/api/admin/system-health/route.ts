import { successResponse, handleApiError } from '@/lib/api-response';
import { withAdminAuth } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';

export const GET = withAdminAuth(async (_request, _user) => {
  try {
    const health = await adminService.getSystemHealth();
    return successResponse(health);
  } catch (error) {
    return handleApiError(error);
  }
});
