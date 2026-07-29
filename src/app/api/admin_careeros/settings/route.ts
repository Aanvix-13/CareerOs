import { withAdmin } from '@/middleware/admin.middleware';
import systemSettingService from '@/services/system-setting.service';
import { successResponse, handleApiError } from '@/lib/api-response';

export const GET = withAdmin(async () => {
  try {
    const settings = await systemSettingService.getSettings();
    return successResponse(settings);
  } catch (error) {
    return handleApiError(error);
  }
});

export const PATCH = withAdmin(async (request: Request, user) => {
  try {
    const body = await request.json();
    const settings = await systemSettingService.updateSettings(user.userId, body);
    return successResponse(settings);
  } catch (error) {
    return handleApiError(error);
  }
});
