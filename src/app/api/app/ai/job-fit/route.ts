import { successResponse, handleApiError } from '@/lib/api-response';
import { withFeatureGate } from '@/middleware/subscription.middleware';
import aiRepository from '@/repositories/ai.repository';
import aiService from '@/services/ai/ai.service';
import { checkAIRateLimit, rateLimitResponse } from '@/utils/rate-limiter';
import { parseBody } from '@/lib/validation';
import { jobFitSchema } from '@/lib/schemas/ai.schemas';

export const POST = withFeatureGate('AI_JOB_FIT', async (request, user) => {
  try {
    if (!await checkAIRateLimit(user.userId)) {
      return rateLimitResponse();
    }

    const { resumeId, jobDescription } = await parseBody(request, jobFitSchema);

    const resumeText = await aiRepository.getResumeText(resumeId, user.userId);
    const result = await aiService.executeJobFitScore(user.userId, resumeText, jobDescription);

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});
