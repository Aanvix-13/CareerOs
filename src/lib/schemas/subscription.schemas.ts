import { z } from 'zod';

export const upgradePlanSchema = z.object({
  plan: z.enum(['PRO', 'ELITE'], {
    message: 'Plan must be PRO or ELITE.',
  }),
  billingCycle: z.enum(['MONTHLY', 'YEARLY'], {
    message: 'Billing cycle must be MONTHLY or YEARLY.',
  }),
});

export const cancelSubscriptionSchema = z.object({
  reason: z.string().max(500).optional(),
});

export type UpgradePlanInput        = z.infer<typeof upgradePlanSchema>;
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;
