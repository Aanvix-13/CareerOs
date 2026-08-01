import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';
import usageService from '@/services/usage.service';

export const GET = withAuth(async (request, user) => {
  try {
    // Sync storage usage from database files before returning summary
    await usageService.syncStorageUsage(user.userId).catch(console.error);
    
    const usageSummary = await usageService.getUsageSummary(user.userId);
    return successResponse(usageSummary);
  } catch (error) {
    return handleApiError(error);
  }
});
