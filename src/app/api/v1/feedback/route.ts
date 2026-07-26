import feedbackService from '@/services/feedback.service';
import { createFeedbackSchema } from '@/validators/feedback';
import { successResponse, handleApiError } from '@/lib/api-response';
import { ValidationError } from '@/lib/errors';
import { withAuth } from '@/middleware/auth.middleware';

export const GET = withAuth(async (request, user) => {
  try {
    const feedbackList = await feedbackService.getFeedbackList(user.userId);
    return successResponse(feedbackList);
  } catch (error) {
    return handleApiError(error);
  }
});

export const POST = withAuth(async (request, user) => {
  try {
    const body = await request.json();
    const result = createFeedbackSchema.safeParse(body);

    if (!result.success) {
      throw new ValidationError('Validation failed.', result.error.flatten().fieldErrors);
    }

    // Extract client info from request headers
    const userAgent = request.headers.get('user-agent') || 'Unknown User-Agent';
    const appVersion = '1.0.0'; // Default MVP version
    const device = userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone') 
      ? 'Mobile' 
      : 'Desktop';
      
    let browser = 'Unknown Browser';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    const feedback = await feedbackService.createFeedback(
      user.userId,
      result.data,
      { appVersion, browser, device }
    );

    return successResponse(feedback, 201);
  } catch (error) {
    return handleApiError(error);
  }
});
