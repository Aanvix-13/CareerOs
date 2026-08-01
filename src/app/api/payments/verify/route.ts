import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';
import paymentService from '@/services/payment.service';
import { parseBody } from '@/lib/validation';
import { verifyPaymentSchema } from '@/lib/schemas/payment.schemas';
import { PlanType, BillingCycle } from '@prisma/client';

export const POST = withAuth(async (request, user) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      plan,
      billingCycle,
      amount,
    } = await parseBody(request, verifyPaymentSchema);

    const verificationResult = await paymentService.verifyCheckoutPayment(user.userId, {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      plan: plan as PlanType,
      billingCycle: billingCycle as BillingCycle,
      amount: Number(amount),
    });

    return successResponse({
      message: 'Payment verified and subscription activated successfully.',
      ...verificationResult,
    });
  } catch (error) {
    return handleApiError(error);
  }
});
