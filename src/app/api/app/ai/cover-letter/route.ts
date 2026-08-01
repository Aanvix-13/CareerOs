import { successResponse, handleApiError } from '@/lib/api-response';
import { withFeatureGate } from '@/middleware/subscription.middleware';
import aiRepository from '@/repositories/ai.repository';
import aiService from '@/services/ai/ai.service';
import { checkAIRateLimit, rateLimitResponse } from '@/utils/rate-limiter';
import { parseBody } from '@/lib/validation';
import { coverLetterSchema } from '@/lib/schemas/ai.schemas';

export const POST = withFeatureGate('AI_COVER_LETTER', async (request, user) => {
  try {
    if (!await checkAIRateLimit(user.userId)) {
      return rateLimitResponse();
    }

    const { resumeId, jobDescription, recipientName, companyName } = await parseBody(
      request,
      coverLetterSchema
    );

    const resumeText = await aiRepository.getResumeText(resumeId, user.userId);
    const result = await aiService.executeCoverLetter(
      user.userId,
      resumeText,
      jobDescription,
      recipientName || 'Hiring Manager',
      companyName || 'Target Company'
    );

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});
