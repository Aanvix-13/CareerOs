import { withAdmin } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';
import { successResponse, handleApiError } from '@/lib/api-response';

export const GET = withAdmin(async () => {
  try {
    const activity = await adminService.getDashboardActivity();
    return successResponse(activity);
  } catch (error) {
    return handleApiError(error);
  }
});
