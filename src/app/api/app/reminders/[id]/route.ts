import reminderService from '@/services/reminder.service';
import { updateReminderSchema } from '@/validators/reminder';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth.middleware';

export const GET = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const reminder = await reminderService.getReminder(user.userId, id);
    return successResponse(reminder);
  } catch (error) {
    return handleApiError(error);
  }
});

export const PUT = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateReminderSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed.', result.error.flatten().fieldErrors);
    }

    const { dueDate, dueTime, ...rest } = result.data;
    const updateData: Record<string, any> = { ...rest };
    
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (dueTime !== undefined) {
      updateData.dueTime = dueTime ? new Date(`1970-01-01T${dueTime}:00Z`) : null;
    }

    const updatedReminder = await reminderService.updateReminder(user.userId, id, updateData);
    return successResponse(updatedReminder);
  } catch (error) {
    return handleApiError(error);
  }
});

export const DELETE = withAuth(async (request, user, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const deletedReminder = await reminderService.deleteReminder(user.userId, id);
    return successResponse(deletedReminder);
  } catch (error) {
    return handleApiError(error);
  }
});
