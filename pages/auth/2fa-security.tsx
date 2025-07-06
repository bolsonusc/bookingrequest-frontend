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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/send-otp`, {
        method: 'POST',
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
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`)
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
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Security</h2>
            <p className="mt-2 text-center text-white-200">
              Keep your account safe by adding your email for extra protection.
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
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending code...
                  </span>
                ) : (
                  'Send verification code'
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