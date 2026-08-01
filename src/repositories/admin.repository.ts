import prisma from '../lib/prisma';
import { PlanType, SubscriptionStatus } from '@prisma/client';

export class AdminRepository {
  /**
   * Get active subscription counts grouped by plan definition
   */
  async getSubscriptionDistribution() {
    return prisma.subscription.groupBy({
      by: ['plan'],
      _count: { userId: true },
      where: {
        status: 'ACTIVE'
      }
    });
  }

  /**
   * Sum total size of resumes stored in DB
   */
  async getStorageConsumption() {
    return prisma.resume.aggregate({
      _sum: {
        fileSize: true
      },
      where: {
        deletedAt: null
      }
    });
  }

  /**
   * Aggregated AI Usage Stats
   */
  async getAIUsageStats() {
    return prisma.aIUsage.aggregate({
      _sum: {
        requestCount: true,
        tokensUsed: true,
        estimatedCost: true
      }
    });
  }

  /**
   * Timeline of Recent Transactions
   */
  async getRecentInvoices(limit = 10) {
    return prisma.billingHistory.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      where: { status: 'SUCCESS' },
      include: {
        user: {
          select: { email: true }
        }
      }
    });
  }

  /**
   * Aggregated actions counts in the last 24h/7d
   */
  async getEngagementCounts(sinceDate: Date) {
    const [resumes, applications, interviews] = await Promise.all([
      prisma.resume.count({
        where: { createdAt: { gte: sinceDate }, deletedAt: null }
      }),
      prisma.application.count({
        where: { createdAt: { gte: sinceDate }, deletedAt: null }
      }),
      prisma.interview.count({
        where: { createdAt: { gte: sinceDate }, deletedAt: null }
      })
    ]);

    return {
      resumesUploaded: resumes,
      applicationsCreated: applications,
      interviewsScheduled: interviews
    };
  }

  /**
   * Retrieve total counters for general overview dashboard
   */
  async getGeneralCounts() {
    const [users, activeSubs, applications, resumes, interviews, avgResumeScore] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.application.count({ where: { deletedAt: null } }),
      prisma.resume.count({ where: { deletedAt: null } }),
      prisma.interview.count({ where: { deletedAt: null } }),
      prisma.aIHistory.aggregate({
        _avg: { executionTime: true }, // As we do not have a hardcoded resume score column, we average execution time
        where: { feature: 'AI_ANALYSIS' }
      })
    ]);

    return {
      totalUsers: users,
      activeSubscriptions: activeSubs,
      totalApplications: applications,
      totalResumes: resumes,
      totalInterviews: interviews,
      avgResponseTimeMs: avgResumeScore._avg.executionTime ?? 0
    };
  }

  /**
   * Query all users with pagination and filters
   */
  async getPaginatedUsers(params: {
    page: number;
    limit: number;
    search?: string;
  }) {
    const skip = (params.page - 1) * params.limit;
    const where: any = {};

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { role: { contains: params.search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          subscription: true
        }
      }),
      prisma.user.count({ where })
    ]);

    return { users, total };
  }
}

export default new AdminRepository();
