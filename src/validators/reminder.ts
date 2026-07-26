import { z } from 'zod';
import { ReminderPriority, ReminderType } from '@prisma/client';

export const createReminderSchema = z.object({
  applicationId: z.string().uuid('Invalid Application ID format.').optional().nullable(),
  interviewId: z.string().uuid('Invalid Interview ID format.').optional().nullable(),
  title: z
    .string({ message: 'Reminder title is required.' })
    .trim()
    .min(2, 'Reminder title must be at least 2 characters.')
    .max(150, 'Reminder title cannot exceed 150 characters.'),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters.')
    .optional()
    .nullable(),
  priority: z.nativeEnum(ReminderPriority, { message: 'Priority is required.' }),
  reminderType: z.nativeEnum(ReminderType, { message: 'Reminder type is required.' }),
  dueDate: z
    .string({ message: 'Due date is required.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be YYYY-MM-DD.'),
  dueTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Due time must be HH:MM.')
    .optional()
    .nullable(),
});

export const updateReminderSchema = z.object({
  applicationId: z.string().uuid('Invalid Application ID format.').optional().nullable(),
  interviewId: z.string().uuid('Invalid Interview ID format.').optional().nullable(),
  title: z
    .string()
    .trim()
    .min(2, 'Reminder title must be at least 2 characters.')
    .max(150, 'Reminder title cannot exceed 150 characters.')
    .optional(),
  description: z.string().max(1000).optional().nullable(),
  priority: z.nativeEnum(ReminderPriority).optional(),
  reminderType: z.nativeEnum(ReminderType).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dueTime: z.string().regex(/^\d{2}:\d{2}$/).optional().nullable(),
});
