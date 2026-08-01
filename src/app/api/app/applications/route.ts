import applicationService from '@/services/application.service';
import { createApplicationSchema } from '@/validators/application';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth.middleware';
import { getPaginationParams, formatPaginatedResult } from '@/utils/pagination';
import { ApplicationStatus } from '@prisma/client';

import { withFeatureGate } from '@/middleware/subscription.middleware';

export const GET = withAuth(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const pagination = getPaginationParams(searchParams);
    
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') as ApplicationStatus || undefined;
    const jobType = searchParams.get('jobType') || undefined;
    const workMode = searchParams.get('workMode') || undefined;
    const source = searchParams.get('source') || undefined;
    const sort = searchParams.get('sort') || undefined;
    const orderStr = searchParams.get('order');
    const order = orderStr === 'asc' || orderStr === 'desc' ? orderStr : undefined;

    const { data, total } = await applicationService.listApplications(user.userId, {
      search,
      status,
      jobType,
      workMode,
      source,
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

export const POST = withFeatureGate('APPLICATIONS', async (request, user) => {
  try {
    const body = await request.json();
    const result = createApplicationSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed.', result.error.flatten().fieldErrors);
    }

    const { applicationDate, salary, ...rest } = result.data;

    const application = await applicationService.createApplication(user.userId, {
      ...rest,
      salary: salary !== undefined && salary !== null ? salary : null,
      applicationDate: new Date(applicationDate),
    } as any);

    return successResponse(application, 201);
  } catch (error) {
    return handleApiError(error);
  }
});
