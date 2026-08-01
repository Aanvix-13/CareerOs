import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';
import usageService from '@/services/usage.service';

export const GET = withAuth(async (request, user) => {
  try {
    const limitsProfile = await usageService.getUserPlanLimits(user.userId);
    return successResponse({
      plan: limitsProfile.plan,
      features: limitsProfile.features,
      limits: limitsProfile.limits
    });
  } catch (error) {
    return handleApiError(error);
  }
});
