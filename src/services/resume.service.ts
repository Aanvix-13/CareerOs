import resumeRepository from '../repositories/resume.repository';
import storageService from './storage.service';
import { Resume } from '@prisma/client';
import { ForbiddenError, NotFoundError, ValidationError } from '../lib/errors';
import notificationService from './notification.service';

export class ResumeService {
  async uploadResume(
    userId: string,
    name: string,
    targetRole: string | null,
    version: string | null,
    notes: string | null,
    file: File
  ): Promise<Resume> {
    // 1. Upload file
    const { fileUrl, fileSize } = await storageService.uploadResume(file, userId);

    // 2. Count existing resumes to set first one as default automatically if no other default exists
    const existingDefault = await resumeRepository.findDefaultByUserId(userId);
    const isDefault = !existingDefault;

    // 3. Create resume record in database
    const resume = await resumeRepository.create({
      userId,
      name,
      targetRole,
      version,
      notes,
      fileUrl,
      fileSize,
      isDefault,
    });

    // 4. Send notification
    await notificationService.createNotification({
      userId,
      type: 'Welcome', // Generic notice
      title: 'Resume Uploaded',
      message: `Resume "${name}" has been uploaded successfully.`,
      relatedEntity: 'Resume',
      relatedEntityId: resume.id,
    });

    return resume;
  }

  async updateResume(
    userId: string,
    resumeId: string,
    data: Partial<Omit<Resume, 'id' | 'userId' | 'fileUrl' | 'fileSize' | 'createdAt' | 'updatedAt'>>
  ): Promise<Resume> {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) {
      throw new NotFoundError('Resume not found.');
    }
    if (resume.userId !== userId) {
      throw new ForbiddenError();
    }

    return resumeRepository.update(resumeId, data);
  }

  async getResume(userId: string, resumeId: string): Promise<Resume> {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) {
      throw new NotFoundError('Resume not found.');
    }
    if (resume.userId !== userId) {
      throw new ForbiddenError();
    }
    return resume;
  }

  async listResumes(
    userId: string,
    options: { search?: string; skip?: number; limit?: number; sort?: string; order?: 'asc' | 'desc' }
  ): Promise<{ data: Resume[]; total: number }> {
    const { resumes, total } = await resumeRepository.findByUserId(userId, options);
    return { data: resumes, total };
  }

  async deleteResume(userId: string, resumeId: string): Promise<Resume> {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) {
      throw new NotFoundError('Resume not found.');
    }
    if (resume.userId !== userId) {
      throw new ForbiddenError();
    }

    // 1. Verify if referenced by any applications
    const isReferenced = await resumeRepository.isReferencedByApplications(resumeId);
    if (isReferenced) {
      throw new ValidationError(
        'Resume is linked to existing job applications. Please delete or update those applications first before deleting the resume.'
      );
    }

    // 2. Automatically set another resume as default if this one is default
    if (resume.isDefault) {
      const { resumes: otherResumes } = await resumeRepository.findByUserId(userId, { limit: 10 });
      const nextDefault = otherResumes.find((r) => r.id !== resumeId);
      if (nextDefault) {
        await resumeRepository.setAsDefault(userId, nextDefault.id);
      }
    }

    // 3. Delete file
    await storageService.deleteFile(resume.fileUrl);

    // 4. Delete DB entry
    return resumeRepository.delete(resumeId);
  }

  async setDefault(userId: string, resumeId: string): Promise<Resume> {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) {
      throw new NotFoundError('Resume not found.');
    }
    if (resume.userId !== userId) {
      throw new ForbiddenError();
    }

    return resumeRepository.setAsDefault(userId, resumeId);
  }
}

export default new ResumeService();
