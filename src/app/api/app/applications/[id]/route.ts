import applicationService from '@/services/application.service';
import { updateApplicationSchema } from '@/validators/application';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth.middleware';

export const GET = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const application = await applicationService.getApplication(user.userId, id);
    return successResponse(application);
  } catch (error) {
    return handleApiError(error);
  }
});

export const PUT = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateApplicationSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed.', result.error.flatten().fieldErrors);
    }

    const { applicationDate, salary, ...rest } = result.data;
    const updateData: Record<string, any> = { ...rest };
    
    if (applicationDate) updateData.applicationDate = new Date(applicationDate);
    if (salary !== undefined) updateData.salary = salary;

    const updatedApp = await applicationService.updateApplication(user.userId, id, updateData);
    return successResponse(updatedApp);
  } catch (error) {
    return handleApiError(error);
  }
});

export const DELETE = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const deletedApp = await applicationService.deleteApplication(user.userId, id);
    return successResponse(deletedApp);
  } catch (error) {
    return handleApiError(error);
  }
});
