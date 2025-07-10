import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Head from 'next/head';
import { useAuth } from '../../src/hooks/useAuth';
import { useRouter } from 'next/router';

const Security = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user) {
      setPageLoading(false);
    }

  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      // Send OTP for 2FA
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user?.id}/email`, {
        method: 'PATCH',
        body: JSON.stringify({
          email
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*'
        }
      });
      const result = await res.json();
      if (res.ok) {
        router.push(`/dashboard/${user?.role}`);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

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
        <title>Onboarding</title>
        <meta name="description" content="Authentication system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-wrap items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div>
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Add your email 
            </h2>
            <p className="mt-2 text-center text-white-200">
              Add your email to receive a notification and update about your account security.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className='bg-[#1E1E1E] rounded-md shadow-sm px-5 py-3 text-sm border-2 border-solid border-[#444444] w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-white mb-0'
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Email
                {isLoading && (
                  <span className="ml-2 animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                )}
              </button>
            </div>
          </form>

          <Link href={`/dashboard/${user?.role}`}
            className='text-center text-sm text-indigo-500 hover:text-indigo-500 mt-4 w-full block'>
            Remind me next time</Link>
        </div>
      </div>
    </>
  )
}

export default Security