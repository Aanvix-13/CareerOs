import prisma from '../lib/prisma';
import userRepository from '../repositories/user.repository';
import feedbackRepository from '../repositories/feedback.repository';
import notificationRepository from '../repositories/notification.repository';
import auditLogRepository from '../repositories/audit-log.repository';
import { User, Feedback, Notification, AuditLog } from '@prisma/client';

export class AdminService {
  async getDashboardStats(): Promise<any> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      newUsersToday,
      totalApplications,
      totalResumes,
      totalInterviews,
      totalFeedback,
      pendingFeedback,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isSuspended: false } }),
      prisma.user.count({ where: { isSuspended: true } }),
      prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.application.count(),
      prisma.resume.count(),
      prisma.interview.count(),
      prisma.feedback.count(),
      prisma.feedback.count({
        where: {
          status: { in: ['Submitted', 'UnderReview'] },
        },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      suspendedUsers,
      newUsersToday,
      totalApplications,
      totalResumes,
      totalInterviews,
      totalFeedback,
      pendingFeedback,
    };
  }

  async getDashboardActivity(): Promise<AuditLog[]> {
    return auditLogRepository.findMany({
      skip: 0,
      take: 20,
    });
  }

  async getUsers(params: {
    page: number;
    limit: number;
    search?: string;
    status?: 'active' | 'suspended';
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ users: any[]; total: number }> {
    const skip = (params.page - 1) * params.limit;
    const [users, total] = await Promise.all([
      userRepository.findMany({
        skip,
        take: params.limit,
        search: params.search,
        status: params.status,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
      }),
      userRepository.count({
        search: params.search,
        status: params.status,
      }),
    ]);

    return { users, total };
  }

  async getUserDetails(userId: string): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        applications: {
          orderBy: { applicationDate: 'desc' },
          include: { resume: true },
        },
        resumes: {
          orderBy: { createdAt: 'desc' },
        },
        feedback: {
          orderBy: { createdAt: 'desc' },
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get interviews and reminders separately
    const interviews = await prisma.interview.findMany({
      where: {
        application: { userId },
      },
      orderBy: { scheduledDate: 'desc' },
      include: { application: true },
    });

    const reminders = await prisma.reminder.findMany({
      where: { userId },
      orderBy: { dueDate: 'desc' },
      include: { application: true },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        isSuspended: user.isSuspended,
        profile: user.profile,
      },
      applications: user.applications,
      resumes: user.resumes,
      feedback: user.feedback,
      notifications: user.notifications,
      interviews,
      reminders,
    };
  }

  async suspendUser(adminId: string, userId: string): Promise<User> {
    const user = await userRepository.updateSuspension(userId, true);
    await auditLogRepository.create({
      adminId,
      action: 'SUSPEND_USER',
      resource: 'USER',
      details: `Suspended user with ID: ${userId} (${user.email})`,
    });
    return user;
  }

  async activateUser(adminId: string, userId: string): Promise<User> {
    const user = await userRepository.updateSuspension(userId, false);
    await auditLogRepository.create({
      adminId,
      action: 'ACTIVATE_USER',
      resource: 'USER',
      details: `Activated user with ID: ${userId} (${user.email})`,
    });
    return user;
  }

  async deleteUser(adminId: string, userId: string): Promise<User> {
    // Save details for the audit log before deleting
    const targetUser = await userRepository.findById(userId);
    if (!targetUser) {
      throw new Error('User not found');
    }

    const deletedUser = await userRepository.delete(userId);
    
    // Delete from Clerk ONLY when permanent deletion is confirmed (having clerkId)
    if (targetUser.clerkId) {
      try {
        const { clerkClient } = await import('@clerk/nextjs/server');
        const client = typeof clerkClient === 'function' ? await (clerkClient as any)() : clerkClient;
        await client.users.deleteUser(targetUser.clerkId);
      } catch (e) {
        console.error('Failed to delete Clerk Auth user:', e);
      }
    }

    await auditLogRepository.create({
      adminId,
      action: 'DELETE_USER',
      resource: 'USER',
      details: `Deleted user with ID: ${userId} (${targetUser.email})`,
    });

    return deletedUser;
  }


  async getFeedback(params: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    status?: string;
  }): Promise<{ feedback: Feedback[]; total: number }> {
    const skip = (params.page - 1) * params.limit;
    const [feedback, total] = await Promise.all([
      feedbackRepository.findMany({
        skip,
        take: params.limit,
        search: params.search,
        category: params.category,
        status: params.status,
      }),
      feedbackRepository.count({
        search: params.search,
        category: params.category,
        status: params.status,
      }),
    ]);

    return { feedback, total };
  }

  async getFeedbackById(feedbackId: string): Promise<Feedback | null> {
    return prisma.feedback.findUnique({
      where: { id: feedbackId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async updateFeedbackStatus(
    adminId: string,
    feedbackId: string,
    status: any,
    adminNotes?: string
  ): Promise<Feedback> {
    const feedback = await feedbackRepository.update(feedbackId, {
      status,
      adminNotes,
    });

    await auditLogRepository.create({
      adminId,
      action: 'UPDATE_FEEDBACK',
      resource: 'FEEDBACK',
      details: `Updated feedback status of ID: ${feedbackId} to ${status}`,
    });

    return feedback;
  }

  async deleteFeedback(adminId: string, feedbackId: string): Promise<Feedback> {
    const feedback = await feedbackRepository.delete(feedbackId);

    await auditLogRepository.create({
      adminId,
      action: 'DELETE_FEEDBACK',
      resource: 'FEEDBACK',
      details: `Deleted feedback with ID: ${feedbackId} by admin`,
    });

    return feedback;
  }

  async sendNotification(
    adminId: string,
    title: string,
    message: string,
    audience: 'All Users' | 'New Users' | 'Selected Users',
    targetUserIds?: string[]
  ): Promise<{ count: number }> {
    let userIds: string[] = [];

    if (audience === 'All Users') {
      const users = await prisma.user.findMany({ select: { id: true } });
      userIds = users.map((u) => u.id);
    } else if (audience === 'New Users') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const users = await prisma.user.findMany({
        where: { createdAt: { gte: oneWeekAgo } },
        select: { id: true },
      });
      userIds = users.map((u) => u.id);
    } else if (audience === 'Selected Users' && targetUserIds) {
      userIds = targetUserIds;
    }

    if (userIds.length === 0) {
      return { count: 0 };
    }

    const notificationsData = userIds.map((userId) => ({
      userId,
      title,
      message,
      type: 'SystemAnnouncement' as const,
      status: 'Unread' as const,
      relatedEntity: null,
      relatedEntityId: null,
    }));

    const count = await notificationRepository.createMany(notificationsData);

    await auditLogRepository.create({
      adminId,
      action: 'SEND_NOTIFICATION',
      resource: 'NOTIFICATION',
      details: `Sent announcement: "${title}" to ${userIds.length} users (${audience})`,
    });

    return { count };
  }

  async getNotificationHistory(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ notifications: any[]; total: number }> {
    const skip = (params.page - 1) * params.limit;
    const [notifications, total] = await Promise.all([
      notificationRepository.findMany({
        skip,
        take: params.limit,
        search: params.search,
      }),
      notificationRepository.count({
        search: params.search,
      }),
    ]);

    return { notifications, total };
  }

  async getAnalytics(timeRange: '7days' | '30days' | '12months'): Promise<any> {
    const now = new Date();
    let startDate = new Date();

    if (timeRange === '7days') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === '30days') {
      startDate.setDate(now.getDate() - 30);
    } else {
      startDate.setMonth(now.getMonth() - 12);
    }

    // Fetch raw records to group in JS for databases
    const [users, applications, interviews, feedback] = await Promise.all([
      prisma.user.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.application.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.interview.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.feedback.findMany({
        select: { category: true },
      }),
    ]);

    // Grouping helper
    const formatKey = (date: Date) => {
      if (timeRange === '12months') {
        return date.toLocaleString('default', { month: 'short', year: '2-digit' });
      }
      return date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
    };

    const groupData = (items: { createdAt: Date }[]) => {
      const groups: Record<string, number> = {};
      items.forEach((item) => {
        const key = formatKey(new Date(item.createdAt));
        groups[key] = (groups[key] || 0) + 1;
      });
      return Object.entries(groups).map(([name, value]) => ({ name, value }));
    };

    const feedbackDist = feedback.reduce((acc: Record<string, number>, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});

    const feedbackDistribution = Object.entries(feedbackDist).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      userGrowth: groupData(users),
      applicationGrowth: groupData(applications),
      interviewActivity: groupData(interviews),
      feedbackDistribution,
    };
  }

  async exportAnalyticsCSV(): Promise<string> {
    const stats = await this.getDashboardStats();
    let csv = 'Metric,Value\n';
    csv += `Total Users,${stats.totalUsers}\n`;
    csv += `Active Users,${stats.activeUsers}\n`;
    csv += `Suspended Users,${stats.suspendedUsers}\n`;
    csv += `New Users Today,${stats.newUsersToday}\n`;
    csv += `Total Applications,${stats.totalApplications}\n`;
    csv += `Total Resumes,${stats.totalResumes}\n`;
    csv += `Total Interviews,${stats.totalInterviews}\n`;
    csv += `Total Feedback,${stats.totalFeedback}\n`;
    csv += `Pending Feedback,${stats.pendingFeedback}\n`;
    return csv;
  }
}

export default new AdminService();
