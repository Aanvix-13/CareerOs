import { withAdmin } from '@/middleware/admin.middleware';
import adminService from '@/services/admin.service';
import { handleApiError } from '@/lib/api-response';

export const GET = withAdmin(async () => {
  try {
    const csv = await adminService.exportAnalyticsCSV();
    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=analytics.csv',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
});
