import feedbackRepository from '../repositories/feedback.repository';
import { Feedback, FeedbackCategory } from '@prisma/client';
import { ForbiddenError, NotFoundError, ValidationError } from '../lib/errors';

export class FeedbackService {
  async createFeedback(
    userId: string,
    data: {
      category: FeedbackCategory;
      title: string;
      description: string;
      screenshotUrl?: string | null;
    },
    clientInfo: { appVersion: string; browser: string; device: string }
  ): Promise<Feedback> {
    return feedbackRepository.create({
      userId,
      category: data.category,
      title: data.title,
      description: data.description,
      screenshotUrl: data.screenshotUrl || null,
      appVersion: clientInfo.appVersion,
      browser: clientInfo.browser,
      device: clientInfo.device,
    });
  }

  async getFeedbackList(userId: string): Promise<Feedback[]> {
    return feedbackRepository.findByUserId(userId);
  }

  async deleteFeedback(userId: string, id: string): Promise<Feedback> {
    const feedback = await feedbackRepository.findById(id);
    if (!feedback) {
      throw new NotFoundError('Feedback record not found.');
    }
    if (feedback.userId !== userId) {
      throw new ForbiddenError();
    }

    // Business rule: Can only delete if status is still 'Submitted'
    if (feedback.status !== 'Submitted') {
      throw new ValidationError('Only feedback in "Submitted" status can be deleted.');
    }

    return feedbackRepository.delete(id);
  }
}

export default new FeedbackService();
