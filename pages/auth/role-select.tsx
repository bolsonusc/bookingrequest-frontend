
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/hooks/useAuth';

export default function RoleSelect() {
  const router = useRouter();
  const { user, loading, session, updateUserMetadata } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user) {
      setPageLoading(false);
    }
  }, [user, loading, router]);

  const handleRoleSelect = async (role: 'provider' | 'client') => {
    try {
      setError('');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user?.id}`, {
        method: 'PUT',
        body: JSON.stringify({role}),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        }
      });
      const { error: updateError } = await res.json();

      if (updateError) throw updateError;
      else updateUserMetadata({role});

      router.push(`/auth/2fa-security`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (pageLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Select Your Role
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleRoleSelect('provider')}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Service Provider
          </button>
          <button
            onClick={() => handleRoleSelect('client')}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Client
          </button>
        </div>
      </div>
    </div>
  );
}
