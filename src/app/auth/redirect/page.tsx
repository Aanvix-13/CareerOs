'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import apiClient from '../../../lib/api-client';

export default function AuthRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const resolveRedirect = async () => {
      try {
        // Fetch user data including role from our PostgreSQL database
        const response: any = await apiClient.get('/auth/me');
        const role = response?.data?.role;

        if (role === 'admin') {
          router.replace('/admin_careeros/dashboard');
        } else {
          router.replace('/app/dashboard');
        }
      } catch (err) {
        // If not authenticated or error, go to sign-in
        router.replace('/sign-in');
      }
    };

    resolveRedirect();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-zinc-400 text-sm">Checking your access level...</p>
      </div>
    </div>
  );
}
