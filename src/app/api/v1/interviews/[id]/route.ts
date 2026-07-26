import interviewService from '@/services/interview.service';
import { updateInterviewSchema } from '@/validators/interview';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth.middleware';

export const GET = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const interview = await interviewService.getInterview(user.userId, id);
    return successResponse(interview);
  } catch (error) {
    return handleApiError(error);
  }
});

export const PUT = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateInterviewSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed.', result.error.flatten().fieldErrors);
    }

    const { scheduledDate, scheduledTime, ...rest } = result.data;
    const updateData: Record<string, any> = { ...rest };
    
    if (scheduledDate) updateData.scheduledDate = new Date(scheduledDate);
    if (scheduledTime) updateData.scheduledTime = new Date(`1970-01-01T${scheduledTime}:00Z`);

    const updatedInterview = await interviewService.updateInterview(user.userId, id, updateData);
    return successResponse(updatedInterview);
  } catch (error) {
    return handleApiError(error);
  }
});

export const DELETE = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const deletedInterview = await interviewService.deleteInterview(user.userId, id);
    return successResponse(deletedInterview);
  } catch (error) {
    return handleApiError(error);
  }
});
