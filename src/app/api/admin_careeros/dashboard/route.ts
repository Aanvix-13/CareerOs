import { withAdmin } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';
import { successResponse, handleApiError } from '@/lib/api-response';

export const GET = withAdmin(async () => {
  try {
    const stats = await adminService.getDashboardStats();
    return successResponse(stats);
  } catch (error) {
    return handleApiError(error);
  }
});
