import { successResponse, handleApiError } from '@/lib/api-response';
import { withFeatureGate } from '@/middleware/subscription.middleware';
import aiRepository from '@/repositories/ai.repository';
import aiService from '@/services/ai/ai.service';
import { checkAIRateLimit, rateLimitResponse } from '@/utils/rate-limiter';
import { parseBody } from '@/lib/validation';
import { careerInsightsSchema } from '@/lib/schemas/ai.schemas';

export const POST = withFeatureGate('CAREER_INSIGHTS', async (request, user) => {
  try {
    if (!await checkAIRateLimit(user.userId)) {
      return rateLimitResponse();
    }

    const { resumeId, industry } = await parseBody(request, careerInsightsSchema);

    const resumeText = await aiRepository.getResumeText(resumeId, user.userId);
    const result = await aiService.executeCareerInsights(user.userId, resumeText, industry);

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});
