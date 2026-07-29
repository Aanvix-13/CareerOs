import { NextRequest } from 'next/server';
import { withAdmin } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';
import { successResponse, handleApiError } from '@/lib/api-response';

export const GET = withAdmin(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || undefined;
    const status = (searchParams.get('status') as 'active' | 'suspended') || undefined;
    const sortBy = (searchParams.get('sortBy') as 'name' | 'createdAt') || undefined;
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined;

    const result = await adminService.getUsers({
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder,
    });

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});
