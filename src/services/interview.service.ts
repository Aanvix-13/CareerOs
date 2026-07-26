import interviewRepository from '../repositories/interview.repository';
import applicationRepository from '../repositories/application.repository';
import { Interview, InterviewStatus, InterviewResult } from '@prisma/client';
import { ForbiddenError, NotFoundError } from '../lib/errors';

export class InterviewService {
  async createInterview(
    userId: string,
    data: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Interview> {
    // 1. Verify application ownership
    const application = await applicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Linked job application not found.');
    }
    if (application.userId !== userId) {
      throw new ForbiddenError('You can only schedule interviews for your own applications.');
    }

    return interviewRepository.create(data);
  }

  async updateInterview(
    userId: string,
    id: string,
    data: Partial<Omit<Interview, 'id' | 'applicationId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Interview> {
    const interview = await interviewRepository.findById(id);
    if (!interview) {
      throw new NotFoundError('Interview round not found.');
    }
    if (interview.application.userId !== userId) {
      throw new ForbiddenError();
    }

    return interviewRepository.update(id, data);
  }

  async updateStatus(
    userId: string,
    id: string,
    status: InterviewStatus,
    result: InterviewResult,
    feedback?: string | null,
    questions?: string | null
  ): Promise<Interview> {
    const interview = await interviewRepository.findById(id);
    if (!interview) {
      throw new NotFoundError('Interview round not found.');
    }
    if (interview.application.userId !== userId) {
      throw new ForbiddenError();
    }

    return interviewRepository.updateStatus(id, status, result, feedback, questions);
  }

  async getInterview(userId: string, id: string): Promise<Interview> {
    const interview = await interviewRepository.findById(id);
    if (!interview) {
      throw new NotFoundError('Interview round not found.');
    }
    if (interview.application.userId !== userId) {
      throw new ForbiddenError();
    }
    return interview;
  }

  async listInterviews(
    userId: string,
    options: {
      applicationId?: string;
      status?: InterviewStatus;
      result?: InterviewResult;
      skip?: number;
      limit?: number;
      sort?: string;
      order?: 'asc' | 'desc';
    }
  ): Promise<{ data: Interview[]; total: number }> {
    const { interviews, total } = await interviewRepository.findByUserId(userId, options);
    return { data: interviews, total };
  }

  async deleteInterview(userId: string, id: string): Promise<Interview> {
    const interview = await interviewRepository.findById(id);
    if (!interview) {
      throw new NotFoundError('Interview round not found.');
    }
    if (interview.application.userId !== userId) {
      throw new ForbiddenError();
    }

    return interviewRepository.delete(id);
  }
}

export default new InterviewService();
