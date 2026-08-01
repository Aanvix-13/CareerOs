import { successResponse, handleApiError } from '@/lib/api-response';
import { withAdminAuth } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';

export const GET = withAdminAuth(async (request, _user) => {
  try {
    const { searchParams } = new URL(request.url);
    const page  = Math.max(1, parseInt(searchParams.get('page')  ?? '1', 10));
    const limit = Math.min(100, parseInt(searchParams.get('limit') ?? '20', 10));
    const search = searchParams.get('search') ?? undefined;

    const result = await adminService.getUsers({ page, limit, search });
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});

