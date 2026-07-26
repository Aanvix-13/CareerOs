import prisma from '../lib/prisma';
import { ApplicationStatus, Interview, Reminder, Application } from '@prisma/client';

export class DashboardService {
  async getDashboardData(userId: string): Promise<{
    totalApplications: number;
    activeApplications: number;
    applicationsByStatus: Record<ApplicationStatus, number>;
    upcomingInterviews: (Interview & { application: { companyName: string; jobTitle: string } })[];
    upcomingReminders: (Reminder & { application?: { companyName: string; jobTitle: string } | null })[];
    recentApplications: (Application & { resume: { name: string } })[];
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Get total applications count
    const totalApplications = await prisma.application.count({
      where: { userId },
    });

    // 2. Count active applications
    // Active statuses: anything that is not Accepted, Rejected, Offer Declined, Withdrawn, or Archived
    const activeStatuses: ApplicationStatus[] = [
      'Wishlist',
      'Preparing',
      'Applied',
      'OnlineAssessment',
      'TechnicalInterview',
      'HRInterview',
      'FinalInterview',
      'OfferReceived',
    ];
    const activeApplications = await prisma.application.count({
      where: {
        userId,
        currentStatus: { in: activeStatuses },
      },
    });

    // 3. Get applications count grouped by status
    const statusCounts = await prisma.application.groupBy({
      by: ['currentStatus'],
      where: { userId },
      _count: { id: true },
    });

    // Initialize all statuses with count 0
    const applicationsByStatus = Object.keys(ApplicationStatus).reduce((acc, status) => {
      acc[status as ApplicationStatus] = 0;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    statusCounts.forEach((group) => {
      applicationsByStatus[group.currentStatus] = group._count.id;
    });

    // 4. Get upcoming interviews
    const upcomingInterviews = await prisma.interview.findMany({
      where: {
        application: { userId },
        status: 'Scheduled',
        scheduledDate: { gte: today },
      },
      orderBy: [
        { scheduledDate: 'asc' },
        { scheduledTime: 'asc' },
      ],
      take: 5,
      include: {
        application: {
          select: {
            companyName: true,
            jobTitle: true,
          },
        },
      },
    });

    // 5. Get upcoming reminders
    const upcomingReminders = await prisma.reminder.findMany({
      where: {
        userId,
        status: 'Pending',
        dueDate: { gte: today },
      },
      orderBy: [
        { dueDate: 'asc' },
        { dueTime: 'asc' },
      ],
      take: 5,
      include: {
        application: {
          select: {
            companyName: true,
            jobTitle: true,
          },
        },
      },
    });

    // 6. Get recent applications
    const recentApplications = await prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        resume: {
          select: { name: true },
        },
      },
    });

    return {
      totalApplications,
      activeApplications,
      applicationsByStatus,
      upcomingInterviews,
      upcomingReminders,
      recentApplications,
    };
  }

  async getSummaryStats(userId: string) {
    const counts = await prisma.application.groupBy({
      by: ['currentStatus'],
      where: { userId },
      _count: { id: true },
    });

    const stats = {
      totalApplications: 0,
      activeApplications: 0,
      interviews: 0,
      offers: 0,
      rejections: 0,
    };

    const activeStatuses: ApplicationStatus[] = [
      'Wishlist',
      'Preparing',
      'Applied',
      'OnlineAssessment',
      'TechnicalInterview',
      'HRInterview',
      'FinalInterview',
      'OfferReceived',
    ];

    counts.forEach((group) => {
      const count = group._count.id;
      stats.totalApplications += count;

      if (activeStatuses.includes(group.currentStatus)) {
        stats.activeApplications += count;
      }

      if (['OnlineAssessment', 'TechnicalInterview', 'HRInterview', 'FinalInterview'].includes(group.currentStatus)) {
        stats.interviews += count; // App status is active in interview phase
      }

      if (['OfferReceived', 'OfferAccepted'].includes(group.currentStatus)) {
        stats.offers += count;
      }

      if (group.currentStatus === 'Rejected') {
        stats.rejections += count;
      }
    });

    return stats;
  }
}

export default new DashboardService();
