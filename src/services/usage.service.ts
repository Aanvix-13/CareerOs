import prisma from '../lib/prisma';
import { FeatureType, PlanType } from '@prisma/client';
import { ConflictError } from '../lib/errors';
import notificationService from './notification.service';

export class UsageService {
  async getOrInitSubscription(userId: string) {
    let sub = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!sub) {
      sub = await prisma.subscription.create({
        data: {
          userId,
          plan: 'FREE',
          status: 'ACTIVE',
          billingCycle: 'MONTHLY',
        },
      });
      // Trigger welcome notification
      await notificationService.triggerWelcome(userId).catch(console.error);
    }
    return sub;
  }

  async getUserPlanLimits(userId: string) {
    const sub = await this.getOrInitSubscription(userId);
    const planDef = await prisma.planDefinition.findUnique({
      where: { plan: sub.plan },
    });

    if (!planDef) {
      throw new Error(`Plan definition for ${sub.plan} not found.`);
    }

    const config = planDef.configuration as any;
    return {
      plan: sub.plan,
      limits: config?.limits || {},
      features: config?.features || {},
    };
  }

  async checkLimit(userId: string, feature: FeatureType, incrementAmount = 1): Promise<boolean> {
    const { limits } = await this.getUserPlanLimits(userId);
    const limit = limits[feature];
    
    if (limit === undefined) {
      return true; // Not explicitly limited
    }
    
    if (limit === -1) {
      return true; // Unlimited
    }

    const currentUsed = await this.getCurrentUsage(userId, feature);
    return (currentUsed + incrementAmount) <= limit;
  }

  async getCurrentUsage(userId: string, feature: FeatureType): Promise<number> {
    const isAIFeature = feature.startsWith('AI_') || feature === 'CAREER_INSIGHTS';

    if (isAIFeature) {
      const now = new Date();
      const month = now.getMonth() + 1; // 1-indexed
      const year = now.getFullYear();

      const aiRecord = await prisma.aIUsage.findUnique({
        where: {
          userId_feature_month_year: {
            userId,
            feature,
            month,
            year
          }
        }
      });
      return aiRecord?.requestCount ?? 0;
    }

    const record = await prisma.usageCounter.findUnique({
      where: {
        userId_feature: {
          userId,
          feature
        }
      }
    });
    return record?.used ?? 0;
  }

  async incrementUsage(userId: string, feature: FeatureType, amount = 1, metadata?: { tokensUsed?: number; estimatedCost?: number }): Promise<void> {
    const { limits } = await this.getUserPlanLimits(userId);
    const limit = limits[feature] ?? -1;

    const isAIFeature = feature.startsWith('AI_') || feature === 'CAREER_INSIGHTS';

    if (isAIFeature) {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const currentUsed = await this.getCurrentUsage(userId, feature);
      if (limit !== -1 && currentUsed + amount > limit) {
        await notificationService.triggerLimitReached(userId, 'AI_QUOTA', currentUsed + amount, limit).catch(console.error);
        throw new ConflictError(`AI feature limit reached for "${feature}". Upgrade plan to increase limits.`);
      }

      await prisma.aIUsage.upsert({
        where: {
          userId_feature_month_year: {
            userId,
            feature,
            month,
            year
          }
        },
        update: {
          requestCount: { increment: amount },
          tokensUsed: { increment: metadata?.tokensUsed ?? 0 },
          estimatedCost: { increment: metadata?.estimatedCost ?? 0 },
          lastUsedAt: new Date()
        },
        create: {
          userId,
          feature,
          requestCount: amount,
          tokensUsed: metadata?.tokensUsed ?? 0,
          estimatedCost: metadata?.estimatedCost ?? 0,
          month,
          year,
          lastUsedAt: new Date()
        }
      });
    } else {
      const currentUsed = await this.getCurrentUsage(userId, feature);
      if (limit !== -1 && currentUsed + amount > limit) {
        await notificationService.triggerLimitReached(userId, feature as any, currentUsed + amount, limit).catch(console.error);
        throw new ConflictError(`Limit reached for "${feature.toLowerCase()}". Please upgrade your plan.`);
      }

      await prisma.usageCounter.upsert({
        where: {
          userId_feature: {
            userId,
            feature
          }
        },
        update: {
          used: { increment: amount },
          limit: limit
        },
        create: {
          userId,
          feature,
          used: amount,
          limit: limit
        }
      });
    }
  }

  async decrementUsage(userId: string, feature: FeatureType, amount = 1): Promise<void> {
    const isAIFeature = feature.startsWith('AI_') || feature === 'CAREER_INSIGHTS';

    if (isAIFeature) {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      await prisma.aIUsage.updateMany({
        where: { userId, feature, month, year },
        data: {
          requestCount: { decrement: amount }
        }
      });
    } else {
      await prisma.usageCounter.updateMany({
        where: { userId, feature },
        data: {
          used: { decrement: amount }
        }
      });
      // Prevent negative usage values
      await prisma.usageCounter.updateMany({
        where: { userId, feature, used: { lt: 0 } },
        data: { used: 0 }
      });
    }
  }

  async syncStorageUsage(userId: string): Promise<number> {
    // 1. Calculate sum of resume file sizes from DB
    const resumesSum = await prisma.resume.aggregate({
      where: { userId },
      _sum: {
        fileSize: true
      }
    });

    const totalUsed = resumesSum._sum.fileSize ?? 0;

    // 2. Upsert usage counter record
    const { limits } = await this.getUserPlanLimits(userId);
    const storageLimit = limits['STORAGE'] ?? (100 * 1024 * 1024); // fallback 100MB

    await prisma.usageCounter.upsert({
      where: {
        userId_feature: {
          userId,
          feature: 'STORAGE'
        }
      },
      update: {
        used: totalUsed,
        limit: storageLimit
      },
      create: {
        userId,
        feature: 'STORAGE',
        used: totalUsed,
        limit: storageLimit
      }
    });

    return totalUsed;
  }

  async getUsageSummary(userId: string) {
    const { limits } = await this.getUserPlanLimits(userId);
    
    const summary: Record<string, { used: number; limit: number }> = {};
    const features: FeatureType[] = [
      'APPLICATIONS',
      'RESUMES',
      'INTERVIEWS',
      'REMINDERS',
      'STORAGE',
      'AI_ANALYSIS',
      'AI_MATCH',
      'AI_REWRITE',
      'AI_COVER_LETTER',
      'AI_INTERVIEW',
      'CAREER_INSIGHTS'
    ];

    for (const f of features) {
      const used = await this.getCurrentUsage(userId, f);
      const limit = limits[f] ?? -1;
      summary[f] = { used, limit };
    }

    return summary;
  }
}

export default new UsageService();
