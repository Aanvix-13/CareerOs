import prisma from '../lib/prisma';
import { ApplicationStatus } from '@prisma/client';

export interface AnalyticsData {
  totalApplications: number;
  interviewRate: number; // % of apps that got at least 1 interview
  offerRate: number;     // % of apps that got an offer
  successRate: number;   // % of apps that got offer accepted
  monthlyApplications: { month: string; count: number }[];
  applicationsBySource: { source: string; count: number }[];
  applicationsByStatus: Record<ApplicationStatus, number>;
}

export class AnalyticsService {
  async getAnalytics(userId: string): Promise<AnalyticsData> {
    // 1. Get total applications
    const totalApplications = await prisma.application.count({
      where: { userId },
    });

    if (totalApplications === 0) {
      return {
        totalApplications: 0,
        interviewRate: 0,
        offerRate: 0,
        successRate: 0,
        monthlyApplications: [],
        applicationsBySource: [],
        applicationsByStatus: Object.keys(ApplicationStatus).reduce((acc, status) => {
          acc[status as ApplicationStatus] = 0;
          return acc;
        }, {} as Record<ApplicationStatus, number>),
      };
    }

    // 2. Count applications with interviews
    const appsWithInterviews = await prisma.application.count({
      where: {
        userId,
        interviews: {
          some: {},
        },
      },
    });

    // 3. Count applications with offers
    const offerStatuses: ApplicationStatus[] = ['OfferReceived', 'OfferAccepted', 'OfferDeclined'];
    const appsWithOffers = await prisma.application.count({
      where: {
        userId,
        currentStatus: { in: offerStatuses },
      },
    });

    // 4. Count accepted offers
    const acceptedOffers = await prisma.application.count({
      where: {
        userId,
        currentStatus: 'OfferAccepted',
      },
    });

    // 5. Rates calculations (round to 1 decimal place)
    const interviewRate = parseFloat(((appsWithInterviews / totalApplications) * 100).toFixed(1));
    const offerRate = parseFloat(((appsWithOffers / totalApplications) * 100).toFixed(1));
    const successRate = parseFloat(((acceptedOffers / totalApplications) * 100).toFixed(1));

    // 6. Monthly applications count (group in-memory from list of dates)
    const allApps = await prisma.application.findMany({
      where: { userId },
      select: { applicationDate: true },
    });

    const monthlyMap: Record<string, number> = {};
    allApps.forEach((app) => {
      const date = new Date(app.applicationDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${month}`; // YYYY-MM
      monthlyMap[key] = (monthlyMap[key] || 0) + 1;
    });

    const monthlyApplications = Object.entries(monthlyMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // 7. Applications by source
    const sourceGroups = await prisma.application.groupBy({
      by: ['source'],
      where: { userId },
      _count: { id: true },
    });

    const applicationsBySource = sourceGroups.map((group) => ({
      source: group.source,
      count: group._count.id,
    }));

    // 8. Applications by status
    const statusGroups = await prisma.application.groupBy({
      by: ['currentStatus'],
      where: { userId },
      _count: { id: true },
    });

    const applicationsByStatus = Object.keys(ApplicationStatus).reduce((acc, status) => {
      acc[status as ApplicationStatus] = 0;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    statusGroups.forEach((group) => {
      applicationsByStatus[group.currentStatus] = group._count.id;
    });

    return {
      totalApplications,
      interviewRate,
      offerRate,
      successRate,
      monthlyApplications,
      applicationsBySource,
      applicationsByStatus,
    };
  }
}

export default new AnalyticsService();
