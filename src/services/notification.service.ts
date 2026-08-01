import notificationRepository from '../repositories/notification.repository';
import { Notification, NotificationStatus, NotificationType, PlanType } from '@prisma/client';
import { ForbiddenError, NotFoundError } from '../lib/errors';
import prisma from '../lib/prisma';
import emailService from './email.service';

export class NotificationService {
  private async getUserDetails(userId: string): Promise<{ email: string; fullName: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
    return {
      email: user?.email || '',
      fullName: user?.profile?.fullName || 'User'
    };
  }

  async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedEntity?: string | null;
    relatedEntityId?: string | null;
  }): Promise<Notification> {
    return notificationRepository.create({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      relatedEntity: data.relatedEntity ?? null,
      relatedEntityId: data.relatedEntityId ?? null,
      status: 'Unread',
    });
  }

  async getNotifications(
    userId: string,
    options: { status?: NotificationStatus; skip?: number; limit?: number }
  ): Promise<{ notifications: Notification[]; total: number }> {
    return notificationRepository.findByUserId(userId, options);
  }

  async markNotificationRead(userId: string, notificationId: string): Promise<Notification> {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification) {
      throw new NotFoundError('Notification not found.');
    }
    if (notification.userId !== userId) {
      throw new ForbiddenError();
    }
    return notificationRepository.markRead(notificationId);
  }

  async markAllNotificationsRead(userId: string): Promise<number> {
    return notificationRepository.markAllRead(userId);
  }

  async deleteNotification(userId: string, notificationId: string): Promise<Notification> {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification) {
      throw new NotFoundError('Notification not found.');
    }
    if (notification.userId !== userId) {
      throw new ForbiddenError();
    }
    return notificationRepository.delete(notificationId);
  }

  // --- Centralized Notification Triggers ---

  async triggerWelcome(userId: string): Promise<Notification> {
    const details = await this.getUserDetails(userId);
    
    // Asynchronously dispatch email in background
    emailService.sendWelcomeEmail(details.email, details.fullName).catch(console.error);

    return this.createNotification({
      userId,
      type: 'Welcome',
      title: 'Welcome to CareerOS!',
      message: `Hello ${details.fullName}, welcome to CareerOS. Start tracking your applications by uploading your first resume!`,
    });
  }

  async triggerUpgrade(userId: string, plan: PlanType, billingCycle: string, amount: number): Promise<Notification> {
    const details = await this.getUserDetails(userId);
    emailService.sendUpgradeEmail(details.email, details.fullName, plan, billingCycle, amount).catch(console.error);

    return this.createNotification({
      userId,
      type: 'SystemAnnouncement',
      title: 'Plan Upgraded',
      message: `Your subscription has been successfully upgraded to the ${plan} plan.`,
    });
  }

  async triggerDowngrade(userId: string, plan: PlanType): Promise<Notification> {
    const details = await this.getUserDetails(userId);
    emailService.sendDowngradeEmail(details.email, details.fullName, plan).catch(console.error);

    return this.createNotification({
      userId,
      type: 'SystemAnnouncement',
      title: 'Plan Downgraded',
      message: `Your subscription has been downgraded to the ${plan} plan.`,
    });
  }

  async triggerPaymentSuccess(userId: string, invoiceNumber: string, amount: number): Promise<Notification> {
    const details = await this.getUserDetails(userId);
    emailService.sendPaymentSuccessEmail(details.email, details.fullName, invoiceNumber, amount).catch(console.error);

    return this.createNotification({
      userId,
      type: 'SystemAnnouncement',
      title: 'Payment Successful',
      message: `We received your payment of ₹${amount} (Invoice: ${invoiceNumber}). Thank you!`,
    });
  }

  async triggerPaymentFailure(userId: string, amount: number, errorReason: string): Promise<Notification> {
    const details = await this.getUserDetails(userId);
    emailService.sendPaymentFailedEmail(details.email, details.fullName, amount, errorReason).catch(console.error);

    return this.createNotification({
      userId,
      type: 'SystemAnnouncement',
      title: 'Payment Failed',
      message: `Your payment of ₹${amount} failed: ${errorReason || 'Declined by bank'}.`,
    });
  }

  async triggerLimitReached(userId: string, feature: 'APPLICATIONS' | 'RESUMES' | 'INTERVIEWS' | 'REMINDERS' | 'STORAGE' | 'AI_QUOTA', currentVal: number, maxLimitVal: number): Promise<Notification> {
    const details = await this.getUserDetails(userId);
    
    let message = '';
    let title = '';

    if (feature === 'STORAGE') {
      title = 'Storage Limit Reached';
      message = `You are using ${(currentVal / (1024 * 1024)).toFixed(1)} MB of your allowed ${(maxLimitVal / (1024 * 1024)).toFixed(1)} MB storage limit. Please upgrade or delete old files.`;
      emailService.sendStorageLimitReachedEmail(details.email, details.fullName, currentVal, maxLimitVal).catch(console.error);
    } else {
      const resourceName = feature.charAt(0) + feature.slice(1).toLowerCase();
      title = `${resourceName} Limit Reached`;
      message = `You have reached the maximum allowed limit for ${resourceName.toLowerCase()} (${currentVal}/${maxLimitVal}) on your current plan.`;
      emailService.sendUsageLimitReachedEmail(details.email, details.fullName, resourceName, maxLimitVal).catch(console.error);
    }

    return this.createNotification({
      userId,
      type: 'ReminderDue',
      title,
      message,
    });
  }
}

export default new NotificationService();
