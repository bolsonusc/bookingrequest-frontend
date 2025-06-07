import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase/client';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '../../src/hooks/useAuth';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user, session, updateUserMetadata } = useAuth();
  const { email } = router.query;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-otp`, {
        method: 'POST',
        body: JSON.stringify({
          email,
          otp,
          id: user.id
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      const result = await res.json();

      if (!res.ok) {
        throw result.message;
      } else {
        const metadata = user?.user_metadata;
        updateUserMetadata({ secure: true });
        router.push(`/dashboard/${metadata?.role}`);
      }

    } catch (err: any) {
      console.error('Verification error:', err);
      const message =
        err?.message || err?.error_description || JSON.stringify(err) || 'An unknown error occurred.';
      setError("Verification Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // Allow only digits

    e.target.value = value;

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
    const otpValue = inputs.current.map((input) => input?.value).join('');
    setOtp(otpValue);
    
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };
  return (
    <>
      <Head>
        <title>Verify Email</title>
        <meta name="description" content="Authentication system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-wrap items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className='mb-2'>
          <div className="max-w-md w-full space-y-8 p-8">
            <div className='mb-3'> 
              <h2 className="mt-0 text-center text-3xl font-extrabold text-white">Verify Email</h2>
              <p className="mt-2 text-center text-sm text-white-200">
                Enter the code sent to {email}
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

            <form onSubmit={handleVerify} className="mt-3 space-y-6">
               <div className="flex items-center justify-between gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  onChange={(e) => handleChange(i, e)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  ref={(el) => {
                    inputs.current[i] = el;
                  }}
                  className="w-full px-3 py-2 border border-2 border-solid border-[#444444] bg-[#1E1E1E] rounded-md text-white  focus:outline-none focus:ring-2 text-center focus:ring-indigo-500 "
                  required
                />
              ))}
            </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>
            <Link href={`/dashboard/${user?.user_metadata?.role}`} >Remind me next time</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default VerifyEmail;
