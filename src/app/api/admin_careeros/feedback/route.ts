import { withAdmin } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';
import { successResponse, handleApiError } from '@/lib/api-response';

export const GET = withAdmin(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;

    const result = await adminService.getFeedback({
      page,
      limit,
      search,
      category,
      status,
    });

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});
