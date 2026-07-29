import resumeService from '@/services/resume.service';
import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';

export const PATCH = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const resume = await resumeService.setDefault(user.userId, id);
    return successResponse(resume);
  } catch (error) {
    return handleApiError(error);
  }
});
