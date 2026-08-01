import crypto from 'crypto';
import { AIProvider } from './providers/ai.provider';
import geminiProvider from './providers/gemini.provider';
import aiRepository from '../../repositories/ai.repository';
import usageService from '../usage.service';
import { AIFeatureRegistry } from '../../lib/ai/registry';
import { FeatureType } from '@prisma/client';
import { ConflictError, ValidationError, AppError } from '../../lib/errors';
import logger from '../../lib/logger';

export class AIService {
  private provider: AIProvider;

  constructor(provider: AIProvider = geminiProvider) {
    this.provider = provider;
  }

  /**
   * Generates a stable SHA-256 hash of inputs to serve as cache key
   */
  private generateInputHash(userId: string, feature: string, inputs: Record<string, string>): string {
    const serializedInputs = JSON.stringify(inputs);
    return crypto
      .createHash('sha256')
      .update(`${userId}:${feature}:${serializedInputs}`)
      .digest('hex');
  }

  /**
   * Helper that evaluates variables against a prompt template
   */
  private compileTemplate(templateStr: string, variables: Record<string, string>): string {
    let compiled = templateStr;
    for (const [key, val] of Object.entries(variables)) {
      compiled = compiled.replaceAll(`\${${key}}`, val || '');
    }
    return compiled;
  }

  /**
   * Standardized execution method that manages caching, provider calls, retries, and ledger records
   */
  public async executeAIFeature(
    userId: string,
    featureKey: string,
    inputs: Record<string, string>
  ): Promise<any> {
    const startTime = Date.now();
    const featureDef = AIFeatureRegistry[featureKey];
    
    if (!featureDef) {
      throw new ValidationError(`Unsupported AI feature: "${featureKey}"`);
    }

    // 1. Validate input keys
    for (const inputKey of featureDef.requiredInputs) {
      if (!inputs[inputKey]) {
        throw new ValidationError(`Missing required input variable: "${inputKey}"`);
      }
    }

    // 2. Generate Hash & Lookup Cache
    const inputHash = this.generateInputHash(userId, featureKey, inputs);
    const cachedRecord = await aiRepository.findHistory(userId, inputHash);

    if (cachedRecord) {
      logger.info(`[AI CACHE HIT] Returning cached execution for user ${userId} | Feature: ${featureKey}`);
      return cachedRecord.responsePayload;
    }

    // 3. Subscription & Limit Check
    const isAllowed = await usageService.checkLimit(userId, featureKey as FeatureType, 1);
    if (!isAllowed) {
      throw new ConflictError(`Your plan limit for ${featureKey.toLowerCase().replace('ai_', '')} has been exceeded. Please upgrade.`);
    }

    // 4. Compile prompt
    const promptText = this.compileTemplate(featureDef.template, inputs);

    let finalResponseText = '';
    let parsedJson: any = null;
    let attempts = 0;
    const maxAttempts = 2; // Initial run + 1 retry

    // 5. Execution & Validation Loop (Retry transient / parsing failures once)
    while (attempts < maxAttempts) {
      attempts++;
      try {
        const result = await this.provider.generate(promptText, {
          model: featureDef.modelPreference,
          systemInstruction: featureDef.systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2
        });

        finalResponseText = result.text;
        parsedJson = JSON.parse(finalResponseText);
        
        // Successful generation and parsing break loop
        break;
      } catch (err: any) {
        logger.warn(`[AI RETRY ATTEMPT ${attempts}/${maxAttempts}] Failure encountered: ${err.message}`);
        
        if (attempts >= maxAttempts) {
          // If exhaustion reached, classify error
          if (err instanceof SyntaxError) {
            throw new AppError('AI engine returned an invalid JSON response structure.', 502, 'AI_PARSING_FAILED');
          }
          throw new AppError(err.message || 'AI request execution failed.', 502, 'AI_EXECUTION_FAILED');
        }
        
        // Wait 500ms before retry
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    const executionTime = Date.now() - startTime;

    // 6. Log trace in AIHistory
    await aiRepository.createHistory({
      userId,
      feature: featureKey as FeatureType,
      inputHash,
      requestPayload: inputs,
      responsePayload: parsedJson,
      executionTime
    });

    // 7. Calculate estimated tokens & costs
    const inputTokens = Math.ceil(promptText.length / 4);
    const outputTokens = Math.ceil(finalResponseText.length / 4);
    const totalTokens = inputTokens + outputTokens;

    let estimatedCost = 0;
    if (featureDef.modelPreference === 'gemini-1.5-pro') {
      estimatedCost = (inputTokens * 1.25 + outputTokens * 5.00) / 1000000;
    } else {
      estimatedCost = (inputTokens * 0.075 + outputTokens * 0.30) / 1000000;
    }

    // 8. Increment monthly limit usage counter
    await usageService.incrementUsage(userId, featureKey as FeatureType, 1, {
      tokensUsed: totalTokens,
      estimatedCost
    });

    logger.info(`[AI EXECUTION SUCCESS] User ${userId} | Feature: ${featureKey} | Cost: $${estimatedCost.toFixed(5)}`);

    return parsedJson;
  }

  /* ─── Client Methods ──────────────────────────────────────────────────────── */

  async executeATSReview(userId: string, resumeText: string) {
    return this.executeAIFeature(userId, 'AI_ANALYSIS', { resumeText });
  }

  async executeResumeMatch(userId: string, resumeText: string, jobDescription: string) {
    return this.executeAIFeature(userId, 'AI_MATCH', { resumeText, jobDescription });
  }

  async executeResumeRewrite(userId: string, sectionText: string, context: string) {
    return this.executeAIFeature(userId, 'AI_REWRITE', { sectionText, context });
  }

  async executeCoverLetter(userId: string, resumeText: string, jobDescription: string, recipientName = 'Hiring Manager', companyName = 'Target Company') {
    return this.executeAIFeature(userId, 'AI_COVER_LETTER', { resumeText, jobDescription, recipientName, companyName });
  }

  async executeInterviewCoach(userId: string, resumeText: string, jobDescription: string, history: string) {
    return this.executeAIFeature(userId, 'AI_INTERVIEW', { resumeText, jobDescription, history });
  }

  async executeCareerInsights(userId: string, resumeText: string, industry: string) {
    return this.executeAIFeature(userId, 'CAREER_INSIGHTS', { resumeText, industry });
  }

  async executeJobFitScore(userId: string, resumeText: string, jobDescription: string) {
    return this.executeAIFeature(userId, 'AI_JOB_FIT', { resumeText, jobDescription });
  }
}

export default new AIService();
