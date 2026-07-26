import resumeService from '@/services/resume.service';
import { updateResumeSchema } from '@/validators/resume';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth.middleware';

export const GET = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const resume = await resumeService.getResume(user.userId, id);
    return successResponse(resume);
  } catch (error) {
    return handleApiError(error);
  }
});

export const PUT = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateResumeSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed.', result.error.flatten().fieldErrors);
    }

    const updatedResume = await resumeService.updateResume(user.userId, id, result.data);
    return successResponse(updatedResume);
  } catch (error) {
    return handleApiError(error);
  }
});

export const DELETE = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const deletedResume = await resumeService.deleteResume(user.userId, id);
    return successResponse(deletedResume);
  } catch (error) {
    return handleApiError(error);
  }
});
