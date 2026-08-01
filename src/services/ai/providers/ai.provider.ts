export interface AIProviderOptions {
  model: 'gemini-1.5-flash' | 'gemini-1.5-pro';
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: 'application/json' | 'text/plain';
}

export interface AIProvider {
  generate(prompt: string, options: AIProviderOptions): Promise<{ text: string; modelUsed: string }>;
}
