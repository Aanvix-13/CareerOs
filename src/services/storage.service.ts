import supabaseAdmin from '../lib/supabase';
import { FILE_LIMITS } from '../constants';
import { ValidationError } from '../lib/errors';
import prisma from '../lib/prisma';
import path from 'path';

export class StorageService {
  private bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'careeros-storage';

  private async ensureBucketExists() {
    try {
      const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
      if (error) throw error;

      const exists = buckets.some(b => b.name === this.bucketName);
      if (!exists) {
        // Create a private bucket
        const { error: createError } = await supabaseAdmin.storage.createBucket(this.bucketName, {
          public: false,
          fileSizeLimit: 10 * 1024 * 1024 * 1024 // 10 GB max limit
        });
        if (createError) throw createError;
        console.log(`Supabase Storage Bucket "${this.bucketName}" created successfully.`);
      }
    } catch (e) {
      console.warn("Unable to check/create Supabase Storage bucket:", e);
    }
  }

  async uploadResume(file: File, userId: string): Promise<{ fileUrl: string; fileSize: number }> {
    // 1. Verify size and type
    if (file.size > FILE_LIMITS.RESUME.MAX_SIZE) {
      throw new ValidationError(`File is too large. Max size is 5MB.`);
    }
    if (!FILE_LIMITS.RESUME.ALLOWED_TYPES.includes(file.type)) {
      throw new ValidationError(`Unsupported file type. Only PDF is allowed.`);
    }

    await this.ensureBucketExists();

    // 2. Upload file to Supabase Storage private path resumes/{userId}/{timestamp}-{filename}
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `resumes/${userId}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      throw new ValidationError(`Failed to upload resume to storage: ${error.message}`);
    }

    return { fileUrl: filePath, fileSize: file.size };
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

    await this.ensureBucketExists();

    // 2. Upload to profiles/{userId}/{timestamp}-{filename}
    const originalExt = path.extname(file.name) || '.png';
    const fileName = `profile-${userId}-${Date.now()}${originalExt}`;
    const filePath = `profiles/${userId}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filePath, buffer, {
        contentType: contentType,
        upsert: true
      });

    if (error) {
      throw new ValidationError(`Failed to upload profile image: ${error.message}`);
    }

    return filePath;
  }

  async deleteResume(filePath: string): Promise<void> {
    if (!filePath || filePath.startsWith('data:')) return;
    await this.ensureBucketExists();

    const { error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .remove([filePath]);

    if (error) {
      console.error(`Failed to delete resume file "${filePath}":`, error.message);
    }
  }

  async deleteProfileImage(filePath: string): Promise<void> {
    await this.deleteResume(filePath);
  }

  async calculateStorageUsage(userId: string): Promise<number> {
    const resumesSum = await prisma.resume.aggregate({
      where: { userId },
      _sum: {
        fileSize: true
      }
    });
    return resumesSum._sum.fileSize ?? 0;
  }

  async generateSignedUrl(filePath: string, expirySeconds = 3600): Promise<string> {
    if (!filePath) return '';
    if (filePath.startsWith('data:') || filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    await this.ensureBucketExists();

    const { data, error } = await supabaseAdmin.storage
      .from(this.bucketName)
      .createSignedUrl(filePath, expirySeconds);

    if (error) {
      console.error(`Failed to generate signed URL for "${filePath}":`, error.message);
      return '';
    }

    return data.signedUrl;
  }

  async deleteFile(filePath: string): Promise<void> {
    await this.deleteResume(filePath);
  }
}

export default new StorageService();
