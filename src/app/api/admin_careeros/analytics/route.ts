import { withAdmin } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';
import { successResponse, handleApiError } from '@/lib/api-response';

export const GET = withAdmin(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = (searchParams.get('timeRange') as '7days' | '30days' | '12months') || '7days';

    const analytics = await adminService.getAnalytics(timeRange);
    return successResponse(analytics);
  } catch (error) {
    return handleApiError(error);
  }
});
