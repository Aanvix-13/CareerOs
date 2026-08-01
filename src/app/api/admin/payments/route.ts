import { successResponse, handleApiError } from '@/lib/api-response';
import { withAdminAuth } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';

export const GET = withAdminAuth(async (_request, _user) => {
  try {
    const [revenue, transactions] = await Promise.all([
      adminService.getRevenueMetrics(),
      adminService.getRecentTransactions()
    ]);
    return successResponse({ revenue, recentTransactions: transactions });
  } catch (error) {
    return handleApiError(error);
  }
});
