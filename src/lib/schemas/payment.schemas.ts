import { z } from 'zod';

export const createOrderSchema = z.object({
  plan: z.enum(['PRO', 'ELITE'], {
    message: 'Plan must be PRO or ELITE.',
  }),
  billingCycle: z.enum(['MONTHLY', 'YEARLY'], {
    message: 'Billing cycle must be MONTHLY or YEARLY.',
  }),
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1, 'razorpayOrderId is required.'),
  razorpayPaymentId: z.string().min(1, 'razorpayPaymentId is required.'),
  razorpaySignature: z.string().min(1, 'razorpaySignature is required.'),
  plan: z.enum(['PRO', 'ELITE'], {
    message: 'Plan must be PRO or ELITE.',
  }),
  billingCycle: z.enum(['MONTHLY', 'YEARLY'], {
    message: 'Billing cycle must be MONTHLY or YEARLY.',
  }),
  amount: z.number({ message: 'amount must be a number.' }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
