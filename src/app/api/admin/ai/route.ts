import { successResponse, handleApiError } from '@/lib/api-response';
import { withAdminAuth } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';

export const GET = withAdminAuth(async (_request, _user) => {
  try {
    const [usage, featureBreakdown, dau] = await Promise.all([
      adminService.getAIUsageMetrics(),
      adminService.getFeatureUsage(),
      adminService.getDailyActiveUsers()
    ]);
    return successResponse({ usage, featureBreakdown, dailyActivity: dau });
  } catch (error) {
    return handleApiError(error);
  }
});
