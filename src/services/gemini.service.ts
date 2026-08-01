import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../lib/logger';

export interface GeminiRequestOptions {
  model: 'gemini-1.5-flash' | 'gemini-1.5-pro';
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: 'application/json' | 'text/plain';
}

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      logger.info('Gemini SDK initialized successfully.');
    } else {
      logger.warn('GEMINI_API_KEY env key is missing. GeminiService running in fallback/mock mode.');
    }
  }

  /**
   * Helper that retries transient failures (timeouts, rate limits, server errors) up to 2 times
   */
  private async retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 2, delay = 1000): Promise<T> {
    let attempt = 0;
    while (true) {
      try {
        return await fn();
      } catch (error: any) {
        const status = error.status || error.statusCode || error.response?.status;
        const isTransient = status === 429 || status >= 500 || error.message?.includes('timeout') || error.message?.includes('fetch failed');

        if (isTransient && attempt < maxRetries) {
          attempt++;
          const backoff = delay * Math.pow(2, attempt);
          logger.warn(`[GEMINI TRANSIENT ERROR] Status ${status}. Retrying attempt ${attempt}/${maxRetries} in ${backoff}ms...`);
          await new Promise((resolve) => setTimeout(resolve, backoff));
          continue;
        }
        throw error;
      }
    }
  }

  /**
   * Directly interfaces with Google Generative AI API
   */
  async generateContent(prompt: string, options: GeminiRequestOptions): Promise<{ text: string; modelUsed: string }> {
    const modelName = options.model;
    
    // Check if genAI client is active
    if (!this.genAI) {
      logger.warn('Mock response returned: Gemini API key is missing.');
      return { 
        text: JSON.stringify({ 
          mocked: true, 
          message: "Developer warning: Please configure GEMINI_API_KEY in your .env file." 
        }), 
        modelUsed: `${modelName}-mock` 
      };
    }

    const modelInstance = this.genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: options.systemInstruction,
      generationConfig: {
        temperature: options.temperature ?? 0.2,
        responseMimeType: options.responseMimeType ?? 'application/json'
      }
    });

    try {
      const response = await this.retryWithBackoff(async () => {
        const result = await modelInstance.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        return result.response;
      });

      const text = response.text();
      if (!text) {
        throw new Error('Gemini API returned an empty response.');
      }

      return { text, modelUsed: modelName };
    } catch (err: any) {
      logger.error(`[GEMINI API ERROR] Model: ${modelName} failed.`, err);
      throw err;
    }
  }
}

export default new GeminiService();
