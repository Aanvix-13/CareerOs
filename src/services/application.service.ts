import applicationRepository from '../repositories/application.repository';
import resumeRepository from '../repositories/resume.repository';
import { Application, ApplicationStatus, ApplicationStatusHistory } from '@prisma/client';
import { ForbiddenError, NotFoundError } from '../lib/errors';

export class ApplicationService {
  async createApplication(
    userId: string,
    data: Omit<Application, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
    historyNotes?: string | null
  ): Promise<Application> {
    // 1. Verify resume belongs to user
    const resume = await resumeRepository.findById(data.resumeId);
    if (!resume) {
      throw new NotFoundError('Linked resume not found.');
    }
    if (resume.userId !== userId) {
      throw new ForbiddenError('You can only link your own resumes.');
    }

    return applicationRepository.create(
      {
        ...data,
        userId,
      },
      historyNotes
    );
  }

  async updateApplication(
    userId: string,
    id: string,
    data: Partial<Omit<Application, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Application> {
    const application = await applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundError('Application not found.');
    }
    if (application.userId !== userId) {
      throw new ForbiddenError();
    }

    // If updating resume, verify ownership
    if (data.resumeId) {
      const resume = await resumeRepository.findById(data.resumeId);
      if (!resume || resume.userId !== userId) {
        throw new ForbiddenError('You can only link your own resumes.');
      }
    }

    return applicationRepository.update(id, data);
  }

  async updateStatus(
    userId: string,
    id: string,
    newStatus: ApplicationStatus,
    notes?: string | null
  ): Promise<Application> {
    const application = await applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundError('Application not found.');
    }
    if (application.userId !== userId) {
      throw new ForbiddenError();
    }

    return applicationRepository.updateStatus(id, newStatus, notes);
  }

  async getApplication(userId: string, id: string): Promise<Application> {
    const application = await applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundError('Application not found.');
    }
    if (application.userId !== userId) {
      throw new ForbiddenError();
    }
    return application;
  }

  async listApplications(
    userId: string,
    options: {
      search?: string;
      status?: ApplicationStatus;
      jobType?: string;
      workMode?: string;
      source?: string;
      skip?: number;
      limit?: number;
      sort?: string;
      order?: 'asc' | 'desc';
    }
  ): Promise<{ data: Application[]; total: number }> {
    const { applications, total } = await applicationRepository.findByUserId(userId, options);
    return { data: applications, total };
  }

  async deleteApplication(userId: string, id: string): Promise<Application> {
    const application = await applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundError('Application not found.');
    }
    if (application.userId !== userId) {
      throw new ForbiddenError();
    }

    return applicationRepository.delete(id);
  }

  async getStatusHistory(userId: string, id: string): Promise<ApplicationStatusHistory[]> {
    const application = await applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundError('Application not found.');
    }
    if (application.userId !== userId) {
      throw new ForbiddenError();
    }

    return applicationRepository.findHistoryByApplicationId(id);
  }
}

export default new ApplicationService();
