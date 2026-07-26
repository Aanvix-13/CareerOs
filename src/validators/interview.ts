import { z } from 'zod';
import { InterviewType, InterviewStatus, InterviewResult } from '@prisma/client';

export const createInterviewSchema = z.object({
  applicationId: z
    .string({ message: 'Application ID is required.' })
    .uuid('Invalid Application ID format.'),
  interviewRound: z
    .string({ message: 'Interview round is required.' })
    .trim()
    .max(100, 'Interview round cannot exceed 100 characters.'),
  interviewType: z.nativeEnum(InterviewType, { message: 'Interview type is required.' }),
  scheduledDate: z
    .string({ message: 'Scheduled date is required.' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Scheduled date must be YYYY-MM-DD.'),
  scheduledTime: z
    .string({ message: 'Scheduled time is required.' })
    .regex(/^\d{2}:\d{2}$/, 'Scheduled time must be HH:MM.'),
  timeZone: z
    .string({ message: 'Time zone is required.' })
    .trim()
    .max(100, 'Time zone cannot exceed 100 characters.'),
  meetingPlatform: z
    .string()
    .max(100, 'Meeting platform cannot exceed 100 characters.')
    .optional()
    .nullable(),
  meetingLink: z
    .string()
    .url('Please enter a valid URL.')
    .or(z.literal(''))
    .optional()
    .nullable(),
  interviewerName: z
    .string()
    .max(100, 'Interviewer name cannot exceed 100 characters.')
    .optional()
    .nullable(),
  interviewerEmail: z
    .string()
    .email('Please enter a valid email address.')
    .or(z.literal(''))
    .optional()
    .nullable(),
  preparationNotes: z
    .string()
    .max(5000, 'Preparation notes cannot exceed 5000 characters.')
    .optional()
    .nullable(),
});

export const updateInterviewSchema = z.object({
  interviewRound: z.string().trim().max(100).optional(),
  interviewType: z.nativeEnum(InterviewType).optional(),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  timeZone: z.string().trim().max(100).optional(),
  meetingPlatform: z.string().max(100).optional().nullable(),
  meetingLink: z.string().url('Please enter a valid URL.').or(z.literal('')).optional().nullable(),
  interviewerName: z.string().max(100).optional().nullable(),
  interviewerEmail: z.string().email('Please enter a valid email.').or(z.literal('')).optional().nullable(),
  preparationNotes: z.string().max(5000).optional().nullable(),
  interviewFeedback: z.string().max(5000).optional().nullable(),
  questionsAsked: z.string().max(5000).optional().nullable(),
  personalNotes: z.string().max(5000).optional().nullable(),
});

export const updateInterviewStatusSchema = z.object({
  status: z.nativeEnum(InterviewStatus, { message: 'Interview status is required.' }),
  result: z.nativeEnum(InterviewResult, { message: 'Interview result is required.' }),
  interviewFeedback: z
    .string()
    .max(5000, 'Interview feedback cannot exceed 5000 characters.')
    .optional()
    .nullable(),
  questionsAsked: z
    .string()
    .max(5000, 'Questions asked cannot exceed 5000 characters.')
    .optional()
    .nullable(),
});
