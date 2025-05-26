import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase/client';
import Link from 'next/link';
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
        updateUserMetadata({secure: true});
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full space-y-8 p-8">
      <div>
        <h2 className="text-center text-3xl font-bold">Verify Phone</h2>
        <p className="mt-2 text-center text-gray-600">
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

      <form onSubmit={handleVerify} className="mt-8 space-y-6">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter verification code"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
      <Link href={`/dashboard/${user?.user_metadata?.role}`} >Remind me next time</Link>
    </div>
  </div>
  )
}

export default VerifyEmail;
