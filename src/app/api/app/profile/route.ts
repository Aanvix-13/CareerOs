import profileService from '@/services/profile.service';
import storageService from '@/services/storage.service';
import { profileSchema } from '@/validators/profile';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth.middleware';

export const GET = withAuth(async (request, user) => {
  try {
    const profile = await profileService.getProfile(user.userId);
    return successResponse(profile);
  } catch (error) {
    return handleApiError(error);
  }
});

export const PUT = withAuth(async (request, user) => {
  try {
    const contentType = request.headers.get('content-type') || '';
    let updateData: Record<string, any> = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Extract profile details from form
      const fullName = formData.get('fullName') as string;
      const phone = formData.get('phone') as string;
      const college = formData.get('college') as string;
      const degree = formData.get('degree') as string;
      const specialization = formData.get('specialization') as string;
      const graduationYearStr = formData.get('graduationYear') as string;
      const preferredRole = formData.get('preferredRole') as string;
      const preferredLocation = formData.get('preferredLocation') as string;
      const bio = formData.get('bio') as string;

      updateData = {
        fullName,
        phone: phone || null,
        college: college || null,
        degree: degree || null,
        specialization: specialization || null,
        graduationYear: graduationYearStr ? parseInt(graduationYearStr, 10) : null,
        preferredRole: preferredRole || null,
        preferredLocation: preferredLocation || null,
        bio: bio || null,
      };

      // Validate metadata
      const validationResult = profileSchema.safeParse(updateData);
      if (!validationResult.success) {
        throw new ValidationError('Validation failed.', validationResult.error.flatten().fieldErrors);
      }
      updateData = validationResult.data;

      // Check if image file is uploaded
      const file = formData.get('file') as File | null;
      if (file && file.size > 0) {
        // Delete old profile image if exists
        const currentProfile = await profileService.getProfile(user.userId);
        if (currentProfile.profileImageUrl) {
          await storageService.deleteFile(currentProfile.profileImageUrl);
        }

        const profileImageUrl = await storageService.uploadProfileImage(file, user.userId);
        updateData.profileImageUrl = profileImageUrl;
      }
    } else {
      const body = await request.json();
      const validationResult = profileSchema.safeParse(body);
      
      if (!validationResult.success) {
        throw new ValidationError('Validation failed.', validationResult.error.flatten().fieldErrors);
      }
      updateData = validationResult.data;
    }

    const updatedProfile = await profileService.updateProfile(user.userId, updateData);
    return successResponse(updatedProfile);
  } catch (error) {
    return handleApiError(error);
  }
});
