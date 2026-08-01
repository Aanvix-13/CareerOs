import { successResponse, handleApiError } from '@/lib/api-response';
import { withAdminAuth } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';

export const GET = withAdminAuth(async (_request, _user) => {
  try {
    const [distribution, revenue, growth] = await Promise.all([
      adminService.getSubscriptionMetrics(),
      adminService.getRevenueMetrics(),
      adminService.getGrowthMetrics()
    ]);
    return successResponse({ distribution, revenue, growth });
  } catch (error) {
    return handleApiError(error);
  }
});
