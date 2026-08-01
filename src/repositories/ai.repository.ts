import prisma from '../lib/prisma';
import { AIHistory, FeatureType } from '@prisma/client';

export class AIRepository {
  /**
   * Find a cached AIHistory record for a given user and input payload hash
   */
  async findHistory(userId: string, inputHash: string): Promise<AIHistory | null> {
    return prisma.aIHistory.findUnique({
      where: {
        userId_inputHash: {
          userId,
          inputHash
        }
      }
    });
  }

  /**
   * Create a new execution trace in the histories table
   */
  async createHistory(data: {
    userId: string;
    feature: FeatureType;
    inputHash: string;
    requestPayload: any;
    responsePayload: any;
    executionTime: number;
  }): Promise<AIHistory> {
    return prisma.aIHistory.create({
      data
    });
  }

  /**
   * Find stored rawText for a resume
   */
  async findResumeText(resumeId: string, userId: string): Promise<string | null> {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId, deletedAt: null },
      select: { rawText: true }
    });
    return resume?.rawText ?? null;
  }

  /**
   * Resolve resume text and cache metadata fallback if missing
   */
  async getResumeText(resumeId: string, userId: string): Promise<string> {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId, deletedAt: null }
    });

    if (!resume) {
      throw new Error('Resume not found.');
    }

    if (resume.rawText) {
      return resume.rawText;
    }

    const fallbackText = `Resume Title: ${resume.name}\nTarget Role: ${resume.targetRole || 'Software Engineer'}\nNotes: ${resume.notes || 'No notes available'}`;
    await this.updateResumeText(resumeId, fallbackText);
    return fallbackText;
  }

  /**
   * Update resume text in the database
   */
  async updateResumeText(resumeId: string, rawText: string): Promise<void> {
    await prisma.resume.update({
      where: { id: resumeId },
      data: { rawText }
    });
  }
}

export default new AIRepository();
