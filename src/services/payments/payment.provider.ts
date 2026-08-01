import { PlanType, BillingCycle } from '@prisma/client';

export interface CreateOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  plan: PlanType;
  billingCycle: BillingCycle;
  amount: number;
}

export interface VerifyPaymentResult {
  success: boolean;
  error?: string;
}

export interface IPaymentProvider {
  name: string;
  createOrder(userId: string, plan: PlanType, billingCycle: BillingCycle, amount: number): Promise<CreateOrderResult>;
  verifyPayment(payload: VerifyPaymentPayload): Promise<VerifyPaymentResult>;
  verifyWebhookSignature(rawBody: string, signature: string): Promise<boolean>;
}
