import interviewService from '@/services/interview.service';
import { updateInterviewStatusSchema } from '@/validators/interview';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth.middleware';

export const PATCH = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateInterviewStatusSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed.', result.error.flatten().fieldErrors);
    }

    const updatedInterview = await interviewService.updateStatus(
      user.userId,
      id,
      result.data.status,
      result.data.result,
      result.data.interviewFeedback,
      result.data.questionsAsked
    );

    return successResponse(updatedInterview);
  } catch (error) {
    return handleApiError(error);
  }
});
