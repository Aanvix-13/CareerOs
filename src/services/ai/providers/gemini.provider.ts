import { AIProvider, AIProviderOptions } from './ai.provider';
import geminiService from '../../gemini.service';

export class GeminiProvider implements AIProvider {
  async generate(prompt: string, options: AIProviderOptions): Promise<{ text: string; modelUsed: string }> {
    return geminiService.generateContent(prompt, options);
  }
}

export default new GeminiProvider();
