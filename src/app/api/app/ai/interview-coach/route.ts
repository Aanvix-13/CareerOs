import { successResponse, handleApiError } from '@/lib/api-response';
import { withFeatureGate } from '@/middleware/subscription.middleware';
import aiRepository from '@/repositories/ai.repository';
import aiService from '@/services/ai/ai.service';
import { checkAIRateLimit, rateLimitResponse } from '@/utils/rate-limiter';
import { parseBody } from '@/lib/validation';
import { interviewCoachSchema } from '@/lib/schemas/ai.schemas';

export const POST = withFeatureGate('AI_INTERVIEW', async (request, user) => {
  try {
    if (!await checkAIRateLimit(user.userId)) {
      return rateLimitResponse();
    }

    const { resumeId, jobDescription, history } = await parseBody(request, interviewCoachSchema);

    const resumeText = await aiRepository.getResumeText(resumeId, user.userId);
    const result = await aiService.executeInterviewCoach(
      user.userId,
      resumeText,
      jobDescription,
      history || ''
    );

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});
