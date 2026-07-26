import resumeService from '@/services/resume.service';
import { createResumeSchema } from '@/validators/resume';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth.middleware';
import { getPaginationParams, formatPaginatedResult } from '@/utils/pagination';

export const GET = withAuth(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const pagination = getPaginationParams(searchParams);
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const orderStr = searchParams.get('order');
    const order = orderStr === 'asc' || orderStr === 'desc' ? orderStr : undefined;

    const { data, total } = await resumeService.listResumes(user.userId, {
      search,
      skip: pagination.skip,
      limit: pagination.limit,
      sort,
      order,
    });

    return successResponse(formatPaginatedResult(data, total, pagination.page, pagination.limit));
  } catch (error) {
    return handleApiError(error);
  }
});

export const POST = withAuth(async (request, user) => {
  try {
    const formData = await request.formData();
    
    // Extract metadata
    const name = formData.get('name') as string;
    const targetRole = formData.get('targetRole') as string;
    const version = formData.get('version') as string;
    const notes = formData.get('notes') as string;

    const validationData = {
      name,
      targetRole: targetRole || null,
      version: version || null,
      notes: notes || null,
    };

    const validationResult = createResumeSchema.safeParse(validationData);
    if (!validationResult.success) {
      throw new ValidationError('Validation failed.', validationResult.error.flatten().fieldErrors);
    }

    // Extract file
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
      throw new ValidationError('Upload file is required.');
    }

    const resume = await resumeService.uploadResume(
      user.userId,
      validationResult.data.name,
      validationResult.data.targetRole || null,
      validationResult.data.version || null,
      validationResult.data.notes || null,
      file
    );

    return successResponse(resume, 201);
  } catch (error) {
    return handleApiError(error);
  }
});
