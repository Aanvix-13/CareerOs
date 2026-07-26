import { createClient } from '@supabase/supabase-js';

// Ensure this file is never imported on the client-side
if (typeof window !== 'undefined') {
  throw new Error('Supabase admin client can only be used on the server.');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
