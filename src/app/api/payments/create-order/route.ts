import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';
import paymentService from '@/services/payment.service';
import { parseBody } from '@/lib/validation';
import { createOrderSchema } from '@/lib/schemas/payment.schemas';
import { PlanType, BillingCycle } from '@prisma/client';

export const POST = withAuth(async (request, user) => {
  try {
    const { plan, billingCycle } = await parseBody(request, createOrderSchema);

    const orderDetails = await paymentService.createCheckoutOrder(
      user.userId,
      plan as PlanType,
      billingCycle as BillingCycle
    );

    return successResponse({
      orderId: orderDetails.orderId,
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      keyId: orderDetails.keyId
    });
  } catch (error) {
    return handleApiError(error);
  }
});
