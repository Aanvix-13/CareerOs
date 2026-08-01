import { successResponse, handleApiError } from '@/lib/api-response';
import { withFeatureGate } from '@/middleware/subscription.middleware';
import aiService from '@/services/ai/ai.service';
import { checkAIRateLimit, rateLimitResponse } from '@/utils/rate-limiter';
import { parseBody } from '@/lib/validation';
import { resumeRewriteSchema } from '@/lib/schemas/ai.schemas';

export const POST = withFeatureGate('AI_REWRITE', async (request, user) => {
  try {
    if (!await checkAIRateLimit(user.userId)) {
      return rateLimitResponse();
    }

    const { sectionText, context } = await parseBody(request, resumeRewriteSchema);

    const result = await aiService.executeResumeRewrite(user.userId, sectionText, context);

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});
