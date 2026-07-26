import { z } from 'zod';
import { JobType, WorkMode, ApplicationStatus } from '@prisma/client';

export const createApplicationSchema = z.object({
  resumeId: z
    .string({ message: 'Resume ID is required.' })
    .uuid('Invalid Resume ID format.'),
  companyName: z
    .string({ message: 'Company name is required.' })
    .trim()
    .min(2, 'Company name must be at least 2 characters.')
    .max(150, 'Company name cannot exceed 150 characters.'),
  jobTitle: z
    .string({ message: 'Job title is required.' })
    .trim()
    .min(2, 'Job title must be at least 2 characters.')
    .max(150, 'Job title cannot exceed 150 characters.'),
  department: z
    .string()
    .max(100, 'Department cannot exceed 100 characters.')
    .optional()
    .nullable(),
  jobType: z.nativeEnum(JobType, { message: 'Job type is required.' }),
  workMode: z.nativeEnum(WorkMode, { message: 'Work mode is required.' }),
  location: z
    .string()
    .max(100, 'Location cannot exceed 100 characters.')
    .optional()
    .nullable(),
  source: z
    .string({ message: 'Source is required.' })
    .trim()
    .max(100, 'Source cannot exceed 100 characters.'),
  recruiterName: z
    .string()
    .max(100, 'Recruiter name cannot exceed 100 characters.')
    .optional()
    .nullable(),
  recruiterEmail: z
    .string()
    .email('Please enter a valid email address.')
    .or(z.literal(''))
    .optional()
    .nullable(),
  salary: z
    .number()
    .positive('Salary must be a positive number.')
    .optional()
    .nullable(),
  jobUrl: z
    .string()
    .url('Please enter a valid URL.')
    .or(z.literal(''))
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(5000, 'Notes cannot exceed 5000 characters.')
    .optional()
    .nullable(),
  currentStatus: z.nativeEnum(ApplicationStatus, { message: 'Current status is required.' }),
  applicationDate: z
    .string({ message: 'Application date is required.' })
    .datetime({ message: 'Invalid Date format, must be ISO string.' })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Application date must be YYYY-MM-DD.')),
});

export const updateApplicationSchema = z.object({
  resumeId: z.string().uuid('Invalid Resume ID format.').optional(),
  companyName: z
    .string()
    .trim()
    .min(2, 'Company name must be at least 2 characters.')
    .max(150, 'Company name cannot exceed 150 characters.')
    .optional(),
  jobTitle: z
    .string()
    .trim()
    .min(2, 'Job title must be at least 2 characters.')
    .max(150, 'Job title cannot exceed 150 characters.')
    .optional(),
  department: z.string().max(100, 'Department cannot exceed 100 characters.').optional().nullable(),
  jobType: z.nativeEnum(JobType).optional(),
  workMode: z.nativeEnum(WorkMode).optional(),
  location: z.string().max(100, 'Location cannot exceed 100 characters.').optional().nullable(),
  source: z.string().trim().max(100, 'Source cannot exceed 100 characters.').optional(),
  recruiterName: z.string().max(100, 'Recruiter name cannot exceed 100 characters.').optional().nullable(),
  recruiterEmail: z.string().email('Please enter a valid email address.').or(z.literal('')).optional().nullable(),
  salary: z.number().positive('Salary must be a positive number.').optional().nullable(),
  jobUrl: z.string().url('Please enter a valid URL.').or(z.literal('')).optional().nullable(),
  notes: z.string().max(5000, 'Notes cannot exceed 5000 characters.').optional().nullable(),
  currentStatus: z.nativeEnum(ApplicationStatus).optional(),
  applicationDate: z
    .string()
    .datetime()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional(),
});

export const updateStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus, { message: 'Status is required.' }),
  notes: z
    .string()
    .max(1000, 'Status notes cannot exceed 1000 characters.')
    .optional()
    .nullable(),
});
