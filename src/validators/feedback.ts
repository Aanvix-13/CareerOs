import { z } from 'zod';
import { FeedbackCategory } from '@prisma/client';

export const createFeedbackSchema = z.object({
  category: z.nativeEnum(FeedbackCategory, { message: 'Feedback category is required.' }),
  title: z
    .string({ message: 'Feedback title is required.' })
    .trim()
    .min(2, 'Feedback title must be at least 2 characters.')
    .max(150, 'Feedback title cannot exceed 150 characters.'),
  description: z
    .string({ message: 'Feedback description is required.' })
    .trim()
    .min(10, 'Feedback description must be at least 10 characters.')
    .max(5000, 'Feedback description cannot exceed 5000 characters.'),
  screenshotUrl: z
    .string()
    .url('Please enter a valid URL.')
    .or(z.literal(''))
    .optional()
    .nullable(),
});
