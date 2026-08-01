import { successResponse, handleApiError, errorResponse } from '@/lib/api-response';
import paymentService from '@/services/payment.service';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-razorpay-signature') || '';
    if (!signature) {
      return errorResponse('UNAUTHORIZED', 'Missing webhook signature.', null, 401);
    }

    const rawBody = await request.text();
    
    const webhookResult = await paymentService.handlePaymentWebhook(rawBody, signature);
    
    return successResponse({
      received: true,
      ...webhookResult
    });
  } catch (error) {
    return handleApiError(error);
  }
}
