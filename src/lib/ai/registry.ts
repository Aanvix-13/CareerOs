import * as atsReview from './prompts/ats-review';
import * as resumeMatch from './prompts/resume-match';
import * as resumeRewrite from './prompts/resume-rewrite';
import * as coverLetter from './prompts/cover-letter';
import * as interviewCoach from './prompts/interview-coach';
import * as careerInsights from './prompts/career-insights';
import * as jobFit from './prompts/job-fit';

export interface AIFeatureDefinition {
  featureKey: string;
  version: string;
  systemInstruction: string;
  template: string;
  requiredInputs: string[];
  modelPreference: 'gemini-1.5-flash' | 'gemini-1.5-pro';
}

export const AIFeatureRegistry: Record<string, AIFeatureDefinition> = {
  AI_ANALYSIS: {
    featureKey: 'AI_ANALYSIS',
    version: atsReview.version,
    systemInstruction: atsReview.systemInstruction,
    template: atsReview.template,
    requiredInputs: ['resumeText'],
    modelPreference: 'gemini-1.5-pro'
  },
  AI_MATCH: {
    featureKey: 'AI_MATCH',
    version: resumeMatch.version,
    systemInstruction: resumeMatch.systemInstruction,
    template: resumeMatch.template,
    requiredInputs: ['resumeText', 'jobDescription'],
    modelPreference: 'gemini-1.5-pro'
  },
  AI_REWRITE: {
    featureKey: 'AI_REWRITE',
    version: resumeRewrite.version,
    systemInstruction: resumeRewrite.systemInstruction,
    template: resumeRewrite.template,
    requiredInputs: ['sectionText', 'context'],
    modelPreference: 'gemini-1.5-flash'
  },
  AI_COVER_LETTER: {
    featureKey: 'AI_COVER_LETTER',
    version: coverLetter.version,
    systemInstruction: coverLetter.systemInstruction,
    template: coverLetter.template,
    requiredInputs: ['resumeText', 'jobDescription', 'recipientName', 'companyName'],
    modelPreference: 'gemini-1.5-flash'
  },
  AI_INTERVIEW: {
    featureKey: 'AI_INTERVIEW',
    version: interviewCoach.version,
    systemInstruction: interviewCoach.systemInstruction,
    template: interviewCoach.template,
    requiredInputs: ['resumeText', 'jobDescription', 'history'],
    modelPreference: 'gemini-1.5-flash'
  },
  CAREER_INSIGHTS: {
    featureKey: 'CAREER_INSIGHTS',
    version: careerInsights.version,
    systemInstruction: careerInsights.systemInstruction,
    template: careerInsights.template,
    requiredInputs: ['resumeText', 'industry'],
    modelPreference: 'gemini-1.5-pro'
  },
  AI_JOB_FIT: {
    featureKey: 'AI_JOB_FIT',
    version: jobFit.version,
    systemInstruction: jobFit.systemInstruction,
    template: jobFit.template,
    requiredInputs: ['resumeText', 'jobDescription'],
    modelPreference: 'gemini-1.5-pro'
  }
};

export default AIFeatureRegistry;
