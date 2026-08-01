import reminderService from '@/services/reminder.service';
import { createReminderSchema } from '@/validators/reminder';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth.middleware';
import { getPaginationParams, formatPaginatedResult } from '@/utils/pagination';
import { ReminderPriority, ReminderStatus, ReminderType } from '@prisma/client';

import { withFeatureGate } from '@/middleware/subscription.middleware';

export const GET = withAuth(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const pagination = getPaginationParams(searchParams);

    const status = searchParams.get('status') as ReminderStatus || undefined;
    const priority = searchParams.get('priority') as ReminderPriority || undefined;
    const reminderType = searchParams.get('reminderType') as ReminderType || undefined;
    const sort = searchParams.get('sort') || undefined;
    const orderStr = searchParams.get('order');
    const order = orderStr === 'asc' || orderStr === 'desc' ? orderStr : undefined;

    const { data, total } = await reminderService.listReminders(user.userId, {
      status,
      priority,
      reminderType,
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

export const POST = withFeatureGate('REMINDERS', async (request, user) => {
  try {
    const body = await request.json();
    const result = createReminderSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed.', result.error.flatten().fieldErrors);
    }

    const { dueDate, dueTime, ...rest } = result.data;

    const reminder = await reminderService.createReminder(user.userId, {
      ...rest,
      dueDate: new Date(dueDate),
      dueTime: dueTime ? new Date(`1970-01-01T${dueTime}:00Z`) : null,
    } as any);

    return successResponse(reminder, 201);
  } catch (error) {
    return handleApiError(error);
  }
});
