'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import useAuthStore from '../../hooks/useAuthStore';

export default function HomePage() {
  const router = useRouter();
  const { checkSession, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await checkSession();
      if (useAuthStore.getState().isAuthenticated) {
        router.replace('/auth/redirect');
      } else {
        router.replace('/sign-in');
      }
    };
    init();
  }, [checkSession, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
    </div>
  );
}
