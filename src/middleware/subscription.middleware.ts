import { withAuth, AuthenticatedHandler } from './auth.middleware';
import { TokenPayload } from '../lib/auth';
import { PlanType, SubscriptionStatus, FeatureType } from '@prisma/client';
import usageService from '../services/usage.service';
import { errorResponse } from '../lib/api-response';
import subscriptionService from '../services/subscription.service';

export interface SubscriptionContext {
  plan: PlanType;
  status: SubscriptionStatus;
  limits: Record<string, number>;
  features: Record<string, boolean>;
  usage: Record<string, number>;
}

export type SubscriptionHandler = (
  request: Request,
  user: TokenPayload,
  subscription: SubscriptionContext,
  context?: any
) => Promise<Response>;

/**
 * Middleware that loads and injects subscription plan details, limits, and current usage
 * into the handler parameters.
 */
export function withSubscription(handler: SubscriptionHandler) {
  return withAuth(async (request, user, context) => {
    try {
      const sub = await subscriptionService.getSubscription(user.userId);
      const limitsProfile = await usageService.getUserPlanLimits(user.userId);
      const summary = await usageService.getUsageSummary(user.userId);

      const usageObj: Record<string, number> = {};
      Object.keys(summary).forEach((key) => {
        usageObj[key] = summary[key].used;
      });

      const subscriptionContext: SubscriptionContext = {
        plan: sub.plan,
        status: sub.status,
        limits: limitsProfile.limits,
        features: limitsProfile.features,
        usage: usageObj
      };

      return await handler(request, user, subscriptionContext, context);
    } catch (error: any) {
      console.error('Subscription Middleware Error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to resolve user subscription.', null, 500);
    }
  });
}

/**
 * Feature gate decorator that checks a plan limit before executing the route handler.
 * Rejects requests with HTTP 409 Conflict if limits are exceeded, returning a unified schema.
 */
import { NextResponse } from 'next/server';

export function withFeatureGate(feature: FeatureType, handler: AuthenticatedHandler) {
  return withAuth(async (request, user, context) => {
    try {
      const planLimits = await usageService.getUserPlanLimits(user.userId);
      const limit = planLimits.limits[feature] ?? -1;
      const currentUsage = await usageService.getCurrentUsage(user.userId, feature);

      const isAllowed = limit === -1 || (currentUsage + 1) <= limit;
      
      if (!isAllowed) {
        const currentPlan = planLimits.plan;
        const recommendedPlan = currentPlan === 'FREE' ? 'PRO' : 'ELITE';
        const friendlyName = feature.charAt(0) + feature.slice(1).toLowerCase();

        return NextResponse.json(
          {
            success: false,
            code: 'LIMIT_EXCEEDED',
            message: `You have reached your ${friendlyName.toLowerCase().slice(0, -1)} limit.`,
            feature,
            currentUsage,
            limit,
            currentPlan,
            recommendedPlan
          },
          { status: 409 }
        );
      }

      return await handler(request, user, context);
    } catch (error: any) {
      if (error.statusCode === 409) {
        const planLimits = await usageService.getUserPlanLimits(user.userId);
        const limit = planLimits.limits[feature] ?? -1;
        const currentUsage = await usageService.getCurrentUsage(user.userId, feature);
        const currentPlan = planLimits.plan;
        const recommendedPlan = currentPlan === 'FREE' ? 'PRO' : 'ELITE';

        return NextResponse.json(
          {
            success: false,
            code: 'LIMIT_EXCEEDED',
            message: error.message,
            feature,
            currentUsage,
            limit,
            currentPlan,
            recommendedPlan
          },
          { status: 409 }
        );
      }
      console.error('Feature Gate Middleware Error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to validate feature limits.', null, 500);
    }
  });
}

/**
 * Access gate decorator that checks if a boolean feature is enabled for the plan.
 * Rejects requests with HTTP 403 Forbidden if feature is locked.
 */
export function withFeatureAccess(featureKey: string, handler: AuthenticatedHandler) {
  return withAuth(async (request, user, context) => {
    try {
      const planLimits = await usageService.getUserPlanLimits(user.userId);
      const isEnabled = !!planLimits.features[featureKey];

      if (!isEnabled) {
        return errorResponse(
          'FEATURE_LOCKED',
          `The requested feature is locked on your current plan. Please upgrade to unlock.`,
          { featureKey, upgradeRequired: true },
          403
        );
      }

      return await handler(request, user, context);
    } catch (error: any) {
      console.error('Feature Access Middleware Error:', error);
      return errorResponse('INTERNAL_ERROR', 'Failed to validate feature access.', null, 500);
    }
  });
}
