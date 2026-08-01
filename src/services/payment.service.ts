import prisma from '../lib/prisma';
import { PlanType, BillingCycle, BillingHistory, BillingStatus } from '@prisma/client';
import { ValidationError, ConflictError, NotFoundError } from '../lib/errors';
import razorpayProvider from './payments/razorpay.provider';
import subscriptionService from './subscription.service';
import notificationService from './notification.service';
import logger from '../lib/logger';

export class PaymentService {
  private provider = razorpayProvider; // Defaults to Razorpay, can be easily changed or dynamic

  async createCheckoutOrder(
    userId: string,
    plan: PlanType,
    billingCycle: BillingCycle
  ) {
    logger.info(`Creating checkout order for user ${userId}`, { plan, billingCycle });

    // 1. Get plan pricing
    const planDef = await prisma.planDefinition.findUnique({
      where: { plan }
    });

    if (!planDef) {
      throw new NotFoundError(`Pricing details for plan ${plan} not found.`);
    }

    const price = billingCycle === 'MONTHLY' ? planDef.monthlyPrice : planDef.yearlyPrice;
    const amount = Number(price);

    if (amount <= 0) {
      throw new ValidationError('Cannot create checkout order for free plans. Use direct plan transition.');
    }

    // 2. Call provider to create payment gateway order
    const orderResult = await this.provider.createOrder(userId, plan, billingCycle, amount);
    
    // 3. Create placeholder BillingHistory in PENDING state
    // First, verify if user has active subscription to link
    const sub = await subscriptionService.getSubscription(userId);

    await prisma.billingHistory.create({
      data: {
        userId,
        subscriptionId: sub.id,
        amount: amount,
        currency: 'INR',
        plan,
        billingCycle,
        status: 'PENDING',
        razorpayOrderId: orderResult.orderId,
      }
    });

    logger.info(`Order created successfully: ${orderResult.orderId}`, { amount });

    return orderResult;
  }

  async verifyCheckoutPayment(
    userId: string,
    payload: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      plan: PlanType;
      billingCycle: BillingCycle;
      amount: number;
    }
  ) {
    logger.info(`Verifying payment for user ${userId}`, {
      orderId: payload.razorpayOrderId,
      paymentId: payload.razorpayPaymentId
    });

    // 1. Idempotency Check: check if already processed successfully
    const existingSuccess = await prisma.billingHistory.findFirst({
      where: {
        razorpayOrderId: payload.razorpayOrderId,
        status: 'SUCCESS'
      }
    });

    if (existingSuccess) {
      logger.info(`Payment already processed successfully. Idempotent return.`, { orderId: payload.razorpayOrderId });
      return { success: true, alreadyProcessed: true };
    }

    // 2. Verify signature using provider
    const verifyResult = await this.provider.verifyPayment(payload);
    
    const matchingBill = await prisma.billingHistory.findFirst({
      where: { razorpayOrderId: payload.razorpayOrderId }
    });

    if (!verifyResult.success) {
      logger.error(`Signature verification failed for order ${payload.razorpayOrderId}`, verifyResult.error);
      
      // Update billing history to FAILED
      if (matchingBill) {
        await prisma.billingHistory.update({
          where: { id: matchingBill.id },
          data: { status: 'FAILED' }
        });
      }

      throw new ValidationError(verifyResult.error || 'Payment signature verification failed. Please contact support.');
    }

    // 3. Complete payment in single atomic subscription transaction
    try {
      const resultSub = await subscriptionService.upgradePlan(userId, payload.plan, payload.billingCycle, {
        amount: payload.amount,
        razorpayOrderId: payload.razorpayOrderId,
        razorpayPaymentId: payload.razorpayPaymentId,
        razorpaySignature: payload.razorpaySignature,
        paymentMethod: 'Razorpay'
      });

      // Generate invoice number YYYY-XXXXXX format
      const year = new Date().getFullYear();
      const randomSeq = Math.floor(100000 + Math.random() * 900000);
      const invoiceNumber = `INV-${year}-${randomSeq}`;

      if (matchingBill) {
        await prisma.billingHistory.update({
          where: { id: matchingBill.id },
          data: {
            status: 'SUCCESS',
            razorpayPaymentId: payload.razorpayPaymentId,
            razorpaySignature: payload.razorpaySignature,
            paymentMethod: 'Razorpay',
            invoiceNumber,
            paidAt: new Date()
          }
        });
      }

      logger.info(`Subscription activated successfully for user ${userId}`, { plan: payload.plan });

      return { success: true, subscription: resultSub };
    } catch (err: any) {
      logger.error(`Database error during subscription activation`, err);
      
      if (matchingBill) {
        await prisma.billingHistory.update({
          where: { id: matchingBill.id },
          data: { status: 'FAILED' }
        });
      }

      throw new ConflictError(err.message || 'Unable to activate subscription. Please contact support.');
    }
  }

  async handlePaymentWebhook(rawBody: string, signature: string) {
    logger.info(`Webhook received. Verifying signature...`);

    // 1. Verify signature
    const isValidSig = await this.provider.verifyWebhookSignature(rawBody, signature);
    if (!isValidSig) {
      logger.error(`Webhook signature verification failed.`);
      throw new ValidationError('Invalid webhook signature');
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    logger.info(`Webhook event verified: ${eventType}`);

    const payload = event.payload;

    if (eventType === 'payment.captured') {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const method = paymentEntity.method;
      
      const notes = paymentEntity.notes || {};
      const userId = notes.userId;
      const plan = notes.subscriptionPlan as PlanType;
      const billingCycle = notes.billingCycle as BillingCycle;
      const amount = paymentEntity.amount / 100; // convert paise to INR

      if (!userId || !plan || !billingCycle) {
        logger.warn(`Webhook missing metadata in notes. Cannot provision.`);
        return { success: false, reason: 'Missing notes metadata' };
      }

      // Idempotency Check
      const existingBill = await prisma.billingHistory.findFirst({
        where: {
          razorpayOrderId: orderId,
          status: 'SUCCESS'
        }
      });

      if (existingBill) {
        logger.info(`Webhook order ${orderId} already processed via client success redirect.`);
        return { success: true, code: 'ALREADY_PROCESSED' };
      }

      logger.info(`Provisioning plan ${plan} via Webhook for user ${userId}...`, { orderId });
      
      // Perform upgrade
      await subscriptionService.upgradePlan(userId, plan, billingCycle, {
        amount,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: 'WEBHOOK_VERIFIED',
        paymentMethod: method || 'Razorpay_Webhook'
      });

      const year = new Date().getFullYear();
      const randomSeq = Math.floor(100000 + Math.random() * 900000);
      const invoiceNumber = `INV-${year}-${randomSeq}`;

      await prisma.billingHistory.updateMany({
        where: { razorpayOrderId: orderId },
        data: {
          status: 'SUCCESS',
          razorpayPaymentId: paymentId,
          razorpaySignature: 'WEBHOOK_VERIFIED',
          paymentMethod: method || 'Razorpay_Webhook',
          invoiceNumber,
          paidAt: new Date()
        }
      });

      logger.info(`Successfully provisioned plan ${plan} via Webhook backup channel.`, { orderId });

      return { success: true };
    } 
    
    if (eventType === 'payment.failed') {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const notes = paymentEntity.notes || {};
      const userId = notes.userId || 'SYSTEM';
      const amount = paymentEntity.amount / 100;
      const errorCode = paymentEntity.error_code || 'declined';
      const errorDesc = paymentEntity.error_description || 'Payment failed';

      logger.warn(`Webhook received payment failure: ${errorCode} - ${errorDesc}`, { orderId });

      await prisma.billingHistory.updateMany({
        where: { razorpayOrderId: orderId },
        data: {
          status: 'FAILED'
        }
      });

      if (userId !== 'SYSTEM') {
        await notificationService.triggerPaymentFailure(userId, amount, errorDesc).catch(console.error);
      }

      return { success: true };
    }

    return { success: true, ignored: true };
  }

  async getBillingHistory(userId: string, page = 1, limit = 10, cursorId?: string) {
    // Perform cleanup of old pending payments before returning history
    await this.cleanupStalePendingPayments(userId).catch(console.error);

    const queryOptions: any = {
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit
    };

    if (cursorId) {
      queryOptions.cursor = { id: cursorId };
      queryOptions.skip = 1;
    } else {
      queryOptions.skip = (page - 1) * limit;
    }

    const [items, total] = await Promise.all([
      prisma.billingHistory.findMany(queryOptions),
      prisma.billingHistory.count({
        where: { userId, deletedAt: null }
      })
    ]);

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Transition stale pending orders older than 30 mins to FAILED
   */
  async cleanupStalePendingPayments(userId?: string) {
    const cutoffTime = new Date(Date.now() - 30 * 60 * 1000); // 30 mins ago
    
    const count = await prisma.billingHistory.updateMany({
      where: {
        ...(userId ? { userId } : {}),
        status: 'PENDING',
        createdAt: { lt: cutoffTime }
      },
      data: {
        status: 'FAILED'
      }
    });

    if (count.count > 0) {
      logger.info(`Cleaned up ${count.count} stale pending payment records.`);
    }

    return count.count;
  }
}

export default new PaymentService();
