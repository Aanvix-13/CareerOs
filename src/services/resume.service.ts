import resumeRepository from '../repositories/resume.repository';
import storageService from './storage.service';
import { Resume } from '@prisma/client';
import { ForbiddenError, NotFoundError, ValidationError, ConflictError } from '../lib/errors';
import notificationService from './notification.service';
import usageService from './usage.service';

export class ResumeService {
  private async signResume(resume: Resume): Promise<Resume> {
    if (!resume) return resume;
    const signedUrl = await storageService.generateSignedUrl(resume.fileUrl);
    return { ...resume, fileUrl: signedUrl };
  }

  private async signResumes(resumes: Resume[]): Promise<Resume[]> {
    return Promise.all(resumes.map((r) => this.signResume(r)));
  }

  async uploadResume(
    userId: string,
    name: string,
    targetRole: string | null,
    version: string | null,
    notes: string | null,
    file: File
  ): Promise<Resume> {
    // 1. Check count limit first
    const canUploadResume = await usageService.checkLimit(userId, 'RESUMES');
    if (!canUploadResume) {
      throw new ConflictError('Resume upload limit reached for your plan. Please upgrade to continue.');
    }

    // 2. Upload file
    const { fileUrl, fileSize } = await storageService.uploadResume(file, userId);

    // 3. Check storage limit
    const currentStorage = await usageService.syncStorageUsage(userId);
    const { limits } = await usageService.getUserPlanLimits(userId);
    const storageLimit = limits['STORAGE'] ?? (100 * 1024 * 1024);

    if (storageLimit !== -1 && (currentStorage + fileSize) > storageLimit) {
      // Delete file and block creation
      await storageService.deleteResume(fileUrl);
      await notificationService.triggerLimitReached(userId, 'STORAGE', currentStorage + fileSize, storageLimit).catch(console.error);
      throw new ConflictError('Storage quota exceeded. Please delete old files or upgrade your plan.');
    }

    // 4. Count existing resumes to set first one as default automatically if no other default exists
    const existingDefault = await resumeRepository.findDefaultByUserId(userId);
    const isDefault = !existingDefault;

    // 5. Create resume record in database
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

    // 6. Update usage counters
    await usageService.incrementUsage(userId, 'RESUMES');
    await usageService.syncStorageUsage(userId);

    // 7. Send notification
    await notificationService.createNotification({
      userId,
      type: 'Welcome', // Generic notice
      title: 'Resume Uploaded',
      message: `Resume "${name}" has been uploaded successfully.`,
      relatedEntity: 'Resume',
      relatedEntityId: resume.id,
    });

    return this.signResume(resume);
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

    const updated = await resumeRepository.update(resumeId, data);
    return this.signResume(updated);
  }

  async getResume(userId: string, resumeId: string): Promise<Resume> {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) {
      throw new NotFoundError('Resume not found.');
    }
    if (resume.userId !== userId) {
      throw new ForbiddenError();
    }
    return this.signResume(resume);
  }

  async listResumes(
    userId: string,
    options: { search?: string; skip?: number; limit?: number; sort?: string; order?: 'asc' | 'desc' }
  ): Promise<{ data: Resume[]; total: number }> {
    const { resumes, total } = await resumeRepository.findByUserId(userId, options);
    const signedData = await this.signResumes(resumes);
    return { data: signedData, total };
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
    const deleted = await resumeRepository.delete(resumeId);

    // 5. Update usage counters
    await usageService.decrementUsage(userId, 'RESUMES');
    await usageService.syncStorageUsage(userId);

    return this.signResume(deleted);
  }

  async setDefault(userId: string, resumeId: string): Promise<Resume> {
    const resume = await resumeRepository.findById(resumeId);
    if (!resume) {
      throw new NotFoundError('Resume not found.');
    }
    if (resume.userId !== userId) {
      throw new ForbiddenError();
    }

    const updated = await resumeRepository.setAsDefault(userId, resumeId);
    return this.signResume(updated);
  }
}

export default new ResumeService();
