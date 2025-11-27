'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

import { User } from '@/types';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export function AuthGuard({ children, allowedRoles, redirectTo = '/login' }: AuthGuardProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    // Not authenticated
    if (!session) {
      router.replace(redirectTo);
      return;
    }

    // Check role authorization if roles specified
    if (allowedRoles && !allowedRoles.includes((session.user as unknown as User).role)) {
      router.replace('/dashboard');
      return;
    }
  }, [session, isPending, router, redirectTo, allowedRoles]);

  // Show nothing while checking auth (prevents flash)
  if (isPending || !session || (allowedRoles && !allowedRoles.includes((session?.user as unknown as User)?.role))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
