import prisma from '../lib/prisma';
import { PlanType, SubscriptionStatus, BillingCycle, Subscription, BillingStatus } from '@prisma/client';
import { ConflictError, NotFoundError } from '../lib/errors';
import notificationService from './notification.service';
import usageService from './usage.service';

export class SubscriptionService {
  async getSubscription(userId: string): Promise<Subscription> {
    return usageService.getOrInitSubscription(userId);
  }

  async upgradePlan(
    userId: string,
    targetPlan: PlanType,
    billingCycle: BillingCycle,
    paymentDetails: {
      amount: number;
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      paymentMethod?: string;
    }
  ): Promise<Subscription> {
    // 1. Fetch current subscription
    const currentSub = await this.getSubscription(userId);

    if (currentSub.plan === targetPlan && currentSub.status === 'ACTIVE' && currentSub.billingCycle === billingCycle) {
      throw new ConflictError(`User is already actively subscribed to ${targetPlan} (${billingCycle}).`);
    }

    // 2. Determine expiration date
    const now = new Date();
    const expiresAt = new Date();
    if (billingCycle === 'MONTHLY') {
      expiresAt.setMonth(now.getMonth() + 1);
    } else {
      expiresAt.setFullYear(now.getFullYear() + 1);
    }

    // 3. Update subscription in transaction
    const updatedSub = await prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.update({
        where: { userId },
        data: {
          plan: targetPlan,
          status: 'ACTIVE',
          billingCycle,
          startsAt: now,
          expiresAt,
          cancelledAt: null
        }
      });

      // Generate invoice/receipt number placeholders
      const invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const receiptNumber = `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Create Billing History record
      await tx.billingHistory.create({
        data: {
          userId,
          subscriptionId: sub.id,
          amount: paymentDetails.amount,
          currency: 'INR',
          plan: targetPlan,
          billingCycle,
          status: 'SUCCESS',
          paymentMethod: paymentDetails.paymentMethod || 'Razorpay',
          razorpayOrderId: paymentDetails.razorpayOrderId,
          razorpayPaymentId: paymentDetails.razorpayPaymentId,
          razorpaySignature: paymentDetails.razorpaySignature,
          invoiceNumber,
          receiptNumber,
          paidAt: now
        }
      });

      // Reset or align usage counters for new plan limits
      const planDef = await tx.planDefinition.findUnique({
        where: { plan: targetPlan }
      });

      if (planDef) {
        const config = planDef.configuration as any;
        const limits = config?.limits || {};

        for (const feature of Object.keys(limits)) {
          const limit = limits[feature];
          await tx.usageCounter.upsert({
            where: {
              userId_feature: {
                userId,
                feature: feature as any
              }
            },
            update: {
              limit: limit
            },
            create: {
              userId,
              feature: feature as any,
              used: 0,
              limit: limit
            }
          });
        }
      }

      return sub;
    });

    // 4. Trigger notifications & emails
    await notificationService.triggerUpgrade(userId, targetPlan, billingCycle, paymentDetails.amount).catch(console.error);
    await notificationService.triggerPaymentSuccess(userId, `INV-${Date.now()}`, paymentDetails.amount).catch(console.error);

    return updatedSub;
  }

  async downgradePlan(userId: string, targetPlan: PlanType): Promise<Subscription> {
    const currentSub = await this.getSubscription(userId);

    if (currentSub.plan === targetPlan) {
      return currentSub;
    }

    const updatedSub = await prisma.$transaction(async (tx) => {
      // Free plan expiresAt is null (forever free)
      const expiresAt = targetPlan === 'FREE' ? null : currentSub.expiresAt;

      const sub = await tx.subscription.update({
        where: { userId },
        data: {
          plan: targetPlan,
          status: 'ACTIVE',
          expiresAt,
          cancelledAt: targetPlan === 'FREE' ? new Date() : null
        }
      });

      // Align usage limits in database
      const planDef = await tx.planDefinition.findUnique({
        where: { plan: targetPlan }
      });

      if (planDef) {
        const config = planDef.configuration as any;
        const limits = config?.limits || {};

        for (const feature of Object.keys(limits)) {
          const limit = limits[feature];
          await tx.usageCounter.updateMany({
            where: { userId, feature: feature as any },
            data: { limit: limit }
          });
        }
      }

      return sub;
    });

    // Trigger downgrade notifications
    await notificationService.triggerDowngrade(userId, targetPlan).catch(console.error);

    return updatedSub;
  }

  async cancelSubscription(userId: string): Promise<Subscription> {
    const sub = await this.getSubscription(userId);
    if (sub.plan === 'FREE') {
      throw new ConflictError('Cannot cancel Free subscription.');
    }

    const updated = await prisma.subscription.update({
      where: { userId },
      data: {
        cancelledAt: new Date()
      }
    });

    // Notify user of cancellation
    await notificationService.createNotification({
      userId,
      type: 'SystemAnnouncement',
      title: 'Subscription Cancelled',
      message: `Your premium plan auto-renewal has been cancelled. You will continue to have access until ${sub.expiresAt?.toLocaleDateString()}.`
    }).catch(console.error);

    return updated;
  }
}

export default new SubscriptionService();
