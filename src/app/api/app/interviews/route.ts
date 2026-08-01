import interviewService from '@/services/interview.service';
import { createInterviewSchema } from '@/validators/interview';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth.middleware';
import { getPaginationParams, formatPaginatedResult } from '@/utils/pagination';
import { InterviewStatus, InterviewResult } from '@prisma/client';

import { withFeatureGate } from '@/middleware/subscription.middleware';

export const GET = withAuth(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const pagination = getPaginationParams(searchParams);

    const applicationId = searchParams.get('applicationId') || undefined;
    const status = searchParams.get('status') as InterviewStatus || undefined;
    const result = searchParams.get('result') as InterviewResult || undefined;
    const sort = searchParams.get('sort') || undefined;
    const orderStr = searchParams.get('order');
    const order = orderStr === 'asc' || orderStr === 'desc' ? orderStr : undefined;

    const { data, total } = await interviewService.listInterviews(user.userId, {
      applicationId,
      status,
      result,
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

export const POST = withFeatureGate('INTERVIEWS', async (request, user) => {
  try {
    const body = await request.json();
    const result = createInterviewSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed.', result.error.flatten().fieldErrors);
    }

    const { scheduledDate, scheduledTime, ...rest } = result.data;

    const interview = await interviewService.createInterview(user.userId, {
      ...rest,
      status: 'Scheduled',
      result: 'Pending',
      scheduledDate: new Date(scheduledDate),
      scheduledTime: new Date(`1970-01-01T${scheduledTime}:00Z`),
    } as any);

    return successResponse(interview, 201);
  } catch (error) {
    return handleApiError(error);
  }
});
