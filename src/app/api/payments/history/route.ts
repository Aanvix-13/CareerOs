import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';
import paymentService from '@/services/payment.service';

export const GET = withAuth(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const cursorId = searchParams.get('cursorId') || undefined;

    const history = await paymentService.getBillingHistory(
      user.userId,
      isNaN(page) ? 1 : page,
      isNaN(limit) ? 10 : limit,
      cursorId
    );

    return successResponse(history);
  } catch (error) {
    return handleApiError(error);
  }
});
