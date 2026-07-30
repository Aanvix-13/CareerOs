import { promises as fs } from 'fs';
import path from 'path';
import { FILE_LIMITS } from '../constants';
import { ValidationError } from '../lib/errors';

export class StorageService {
  private uploadDir = path.join(process.cwd(), 'public', 'uploads');

  constructor() {
    // Ensure the upload directory exists
    fs.mkdir(this.uploadDir, { recursive: true }).catch(() => {});
  }

  async uploadResume(file: File, userId: string): Promise<{ fileUrl: string; fileSize: number }> {
    // 1. Verify size and type
    if (file.size > FILE_LIMITS.RESUME.MAX_SIZE) {
      throw new ValidationError(`File is too large. Max size is 5MB.`);
    }
    if (!FILE_LIMITS.RESUME.ALLOWED_TYPES.includes(file.type)) {
      throw new ValidationError(`Unsupported file type. Only PDF is allowed.`);
    }

    // 2. Write file
    const fileExtension = '.pdf';
    const fileName = `resume-${userId}-${Date.now()}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);
      const fileUrl = `/uploads/${fileName}`;
      return { fileUrl, fileSize: file.size };
    } catch (error) {
      // Fallback for serverless (e.g. Vercel) read-only filesystem
      const base64 = buffer.toString('base64');
      const fileUrl = `data:${file.type || 'application/pdf'};base64,${base64}`;
      return { fileUrl, fileSize: file.size };
    }
  }

  async uploadProfileImage(file: File, userId: string): Promise<string> {
    // 1. Verify size and type
    if (file.size > FILE_LIMITS.PROFILE_IMAGE.MAX_SIZE) {
      throw new ValidationError(`File is too large. Max size is 2MB.`);
    }
    const contentType = file.type || '';
    if (!FILE_LIMITS.PROFILE_IMAGE.ALLOWED_TYPES.includes(contentType)) {
      throw new ValidationError(`Unsupported image type. Allowed types are JPEG, JPG, and PNG.`);
    }

    // 2. Write file
    const originalExt = path.extname(file.name) || '.png';
    const fileName = `profile-${userId}-${Date.now()}${originalExt}`;
    const filePath = path.join(this.uploadDir, fileName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);
      return `/uploads/${fileName}`;
    } catch (error) {
      // Fallback for serverless (e.g. Vercel) read-only filesystem
      const base64 = buffer.toString('base64');
      return `data:${file.type || 'image/png'};base64,${base64}`;
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (!fileUrl.startsWith('/uploads/')) return;
    
    const fileName = fileUrl.replace('/uploads/', '');
    const filePath = path.join(this.uploadDir, fileName);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Ignored if file does not exist or cannot be unlinked
    }
  }
}

export default new StorageService();
