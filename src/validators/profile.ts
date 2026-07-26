import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z
    .string({ message: 'Full name is required.' })
    .trim()
    .min(2, 'Full name must be at least 2 characters.')
    .max(100, 'Full name cannot exceed 100 characters.'),
  phone: z
    .string()
    .max(20, 'Phone number cannot exceed 20 characters.')
    .optional()
    .nullable(),
  college: z
    .string()
    .max(150, 'College name cannot exceed 150 characters.')
    .optional()
    .nullable(),
  degree: z
    .string()
    .max(100, 'Degree name cannot exceed 100 characters.')
    .optional()
    .nullable(),
  specialization: z
    .string()
    .max(100, 'Specialization cannot exceed 100 characters.')
    .optional()
    .nullable(),
  graduationYear: z
    .number()
    .int()
    .min(1900)
    .max(2100)
    .optional()
    .nullable(),
  preferredRole: z
    .string()
    .max(100, 'Preferred role cannot exceed 100 characters.')
    .optional()
    .nullable(),
  preferredLocation: z
    .string()
    .max(100, 'Preferred location cannot exceed 100 characters.')
    .optional()
    .nullable(),
  bio: z
    .string()
    .max(1000, 'Bio cannot exceed 1000 characters.')
    .optional()
    .nullable(),
});
