import { createServerClient } from '@supabase/ssr';
import { AuthError } from './errors';

export interface TokenPayload {
  userId: string;
  email: string;
}

export async function getCurrentUser(request: Request): Promise<TokenPayload> {
  let token: string | null = null;

  // 1. Try to get token from Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (token) {
    // If we have a bearer token, verify it directly
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      throw new AuthError(error?.message || 'Invalid or expired token.');
    }
    return { userId: user.id, email: user.email! };
  }

  // 2. Fall back to Cookie header
  const cookieHeader = request.headers.get('Cookie') || '';
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          const { parseCookie } = require('cookie');
          const cookies = parseCookie(cookieHeader);
          return Object.entries(cookies).map(([name, value]) => ({ name, value: value as string }));
        },
        setAll() {
          // Read-only context for getCurrentUser
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new AuthError(error?.message || 'Authentication token not found.');
  }

  return { userId: user.id, email: user.email! };
}
