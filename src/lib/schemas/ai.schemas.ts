import { z } from 'zod';

const resumeIdField = z.string().uuid('resumeId must be a valid UUID.');
const jobDescriptionField = z.string().min(10, 'jobDescription must be at least 10 characters.');

export const atsReviewSchema = z.object({
  resumeId: resumeIdField,
});

export const resumeMatchSchema = z.object({
  resumeId: resumeIdField,
  jobDescription: jobDescriptionField,
});

export const resumeRewriteSchema = z.object({
  sectionText: z.string().min(1, 'sectionText is required.'),
  context: z.string().min(1, 'context is required.'),
});

export const coverLetterSchema = z.object({
  resumeId: resumeIdField,
  jobDescription: jobDescriptionField,
  recipientName: z.string().optional(),
  companyName: z.string().optional(),
});

export const interviewCoachSchema = z.object({
  resumeId: resumeIdField,
  jobDescription: jobDescriptionField,
  history: z.string().optional(),
});

export const careerInsightsSchema = z.object({
  resumeId: resumeIdField,
  industry: z.string().min(1, 'industry is required.'),
});

export const jobFitSchema = z.object({
  resumeId: resumeIdField,
  jobDescription: jobDescriptionField,
});

export const aiTestSchema = z.object({
  featureKey: z.string().min(1, 'featureKey is required.'),
  inputs: z.record(z.string(), z.string()),
});

export type ATSReviewInput       = z.infer<typeof atsReviewSchema>;
export type ResumeMatchInput     = z.infer<typeof resumeMatchSchema>;
export type ResumeRewriteInput   = z.infer<typeof resumeRewriteSchema>;
export type CoverLetterInput     = z.infer<typeof coverLetterSchema>;
export type InterviewCoachInput  = z.infer<typeof interviewCoachSchema>;
export type CareerInsightsInput  = z.infer<typeof careerInsightsSchema>;
export type JobFitInput          = z.infer<typeof jobFitSchema>;
export type AITestInput          = z.infer<typeof aiTestSchema>;
