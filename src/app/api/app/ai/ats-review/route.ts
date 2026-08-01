import { successResponse, handleApiError } from '@/lib/api-response';
import { withFeatureGate } from '@/middleware/subscription.middleware';
import aiRepository from '@/repositories/ai.repository';
import aiService from '@/services/ai/ai.service';
import { checkAIRateLimit, rateLimitResponse } from '@/utils/rate-limiter';
import { parseBody } from '@/lib/validation';
import { atsReviewSchema } from '@/lib/schemas/ai.schemas';

export const POST = withFeatureGate('AI_ANALYSIS', async (request, user) => {
  try {
    if (!await checkAIRateLimit(user.userId)) {
      return rateLimitResponse();
    }

    const { resumeId } = await parseBody(request, atsReviewSchema);

    const resumeText = await aiRepository.getResumeText(resumeId, user.userId);
    const result = await aiService.executeATSReview(user.userId, resumeText);

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});
