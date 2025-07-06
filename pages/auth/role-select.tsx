
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../../src/hooks/useAuth';
import Image from 'next/image';

export default function RoleSelect() {
  const router = useRouter();
  const { user, loading } = useAuth();
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user?.id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const { error: updateError } = await res.json();

      if (updateError) throw updateError;

      router.push(`/auth/2fa-security`);
    } catch (err: any) {
      setError(err);
    }
  };

  if (pageLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Select Your Role</title>
        <meta name="description" content="Authentication system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-wrap items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Select Your Role
            </h2>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => handleRoleSelect('provider')}
              className="bg-[#1E1E1E] rounded-md shadow-sm px-5 py-3  border-2 border-solid border-[#444444] w-full mr-2 hover:bg-[#2E2E2E] transition duration-200 text-white-200 cursor-pointer"
            >
              <Image
                src="/circle-user.png"
                alt="Client Icon"
                width={98}
                height={98}
                className="block my-2 mx-auto"
              />
              I am a provider
            </button>
            <button
              onClick={() => handleRoleSelect('client')}
              className="bg-[#1E1E1E] rounded-md shadow-sm px-5 py-3  border-2 border-solid border-[#444444] w-full ml-2 hover:bg-[#2E2E2E] transition duration-200 text-white-200 cursor-pointer"
            >

              <Image
                src="/circle-user.png"
                alt="Client Icon"
                width={98}
                height={98}
                className="block my-2 mx-auto"
              />
              I am a client
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
