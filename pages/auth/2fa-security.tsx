import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../src/hooks/useAuth';
import { useRouter } from 'next/router';

const Security = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const router = useRouter();
  const { user, loading, session } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user) {
      setPageLoading(false);
    }

  }, [user, loading, router]);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setIsLoading(true);
    try{
      // Send OTP for 2FA
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/send-otp`, {
        method: 'POST',
        body: JSON.stringify({
          email
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        }
      });
      const result = await res.json();
      if(res.ok){
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`)
      } else {
        setError(result.message);
      }      
    } catch(error){
      setError(error);
    } finally{
      setIsLoading(false);
    }
  }
  
  if (pageLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2 className="text-center text-3xl font-bold">Security</h2>
        <p className="mt-2 text-center text-gray-600">
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

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

      <Link href={`/dashboard/${user?.user_metadata?.role}`} >Remind me next time</Link>
    </div>
  )
}

export default Security