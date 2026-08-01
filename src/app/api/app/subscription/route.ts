import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';
import subscriptionService from '@/services/subscription.service';

export const GET = withAuth(async (request, user) => {
  try {
    const sub = await subscriptionService.getSubscription(user.userId);
    return successResponse({
      id: sub.id,
      plan: sub.plan,
      status: sub.status,
      billingCycle: sub.billingCycle,
      startsAt: sub.startsAt,
      expiresAt: sub.expiresAt,
      cancelledAt: sub.cancelledAt,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt
    });
  } catch (error) {
    return handleApiError(error);
  }
});
