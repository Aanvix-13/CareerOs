import { successResponse, handleApiError } from '@/lib/api-response';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return successResponse({ message: 'Logged out successfully.' });
  } catch (error) {
    return handleApiError(error);
  }
}
