
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/hooks/useAuth';

export default function Success() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user) {
      setPageLoading(false);
    }

    const timer = setTimeout(async () => {
      router.push('/auth/onboarding');
    }, 3000);
  
    return () => clearTimeout(timer);
  }, [user, loading, router]);

  if (pageLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          {/* You&apos;ve selected your role! */}
          Let&apos;s get you onboard
        </h2>
        <p className="text-gray-600">
          Click <strong onClick={()=>router.push('/auth/onboarding')}>here</strong> if you not redirected automatically
        </p>
      </div>
    </div>
  );
}
