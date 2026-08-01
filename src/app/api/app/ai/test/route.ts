import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';
import aiService from '@/services/ai.service';
import { NextResponse } from 'next/server';
import { parseBody } from '@/lib/validation';
import { aiTestSchema } from '@/lib/schemas/ai.schemas';

export const POST = withAuth(async (request, user) => {
  try {
    // 1. Authorization: Only allow Admin and Developer roles
    if (user.role !== 'Admin' && user.role !== 'Developer') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Forbidden: Admin/Developer access required.' } },
        { status: 403 }
      );
    }

    const { featureKey, inputs } = await parseBody(request, aiTestSchema);

    const result = await aiService.executeAIFeature(user.userId, featureKey, inputs);

    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
});
