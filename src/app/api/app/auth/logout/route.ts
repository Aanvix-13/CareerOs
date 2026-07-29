import { successResponse, handleApiError } from '@/lib/api-response';

export async function POST() {
  try {
    return successResponse({ message: 'Logged out successfully.' });
  } catch (error) {
    return handleApiError(error);
  }
}
