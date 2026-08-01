import { successResponse, handleApiError } from '@/lib/api-response';
import { withAdminAuth } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';

export const GET = withAdminAuth(async (_request, _user) => {
  try {
    const result = await adminService.getDashboardOverview();
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});

