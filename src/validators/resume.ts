import { z } from 'zod';

export const createResumeSchema = z.object({
  name: z
    .string({ message: 'Resume name is required.' })
    .trim()
    .min(2, 'Resume name must be at least 2 characters.')
    .max(100, 'Resume name cannot exceed 100 characters.'),
  targetRole: z
    .string()
    .max(100, 'Target role cannot exceed 100 characters.')
    .optional()
    .nullable(),
  version: z
    .string()
    .max(30, 'Version cannot exceed 30 characters.')
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(1000, 'Notes cannot exceed 1000 characters.')
    .optional()
    .nullable(),
});

export const updateResumeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Resume name must be at least 2 characters.')
    .max(100, 'Resume name cannot exceed 100 characters.')
    .optional(),
  targetRole: z
    .string()
    .max(100, 'Target role cannot exceed 100 characters.')
    .optional()
    .nullable(),
  version: z
    .string()
    .max(30, 'Version cannot exceed 30 characters.')
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(1000, 'Notes cannot exceed 1000 characters.')
    .optional()
    .nullable(),
});
