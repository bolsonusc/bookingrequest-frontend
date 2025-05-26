
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from "next/head";
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../src/hooks/useAuth';
import Link from 'next/link';
import PhoneInput, {
  isValidPhoneNumber
} from 'react-phone-number-input'

import 'react-phone-number-input/style.css'


export default function Login() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const metadata = user?.user_metadata;
    const timer = setTimeout(async () => {
      if (metadata && !metadata?.username) {
        router.push('/auth/onboarding');
      } else if (metadata && !metadata?.role) {
        router.push('/auth/role-select');
      } else if (user) {
        router.push(`/dashboard/${metadata?.role}`);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');


    // Validate phone number
    if (!phone) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }
    if (!isValidPhoneNumber(phone)) {
      setError('Invalid phone number');
      setLoading(false);
      return;
    }

    try {
      // Check if user exists in users table
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users?phone=${encodeURIComponent(phone)}`);
      const { data: existingUser } = await res.json();

      if (!existingUser) {
        setError(<>
          This phone number is not registered. Please register instead.<br />
          <Link href={"/auth/register"}>Click here to register.</Link>
        </>);
        setShow(false);
        return;
      }
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });

      if (error) {
        if (error.message.includes('Invalid parameter')) {
          setError('Please enter a valid phone number in international format (e.g. +1234567890)');
          return;
        }
        throw error;
      }

      // Store phone in session storage for later use
      sessionStorage.setItem('registrationPhone', phone);

      // Redirect to verify page
      router.push(`/auth/verify?phone=${encodeURIComponent(phone)}`);
    } catch (err: any) {
      setError('Unable to send verification code. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Authentication system" />
        <link rel="icon" href="/favicon.ico" />
        <style>
          {`
          
            .PhoneInputCountrySelect option  {
              color: #1E1E1E;
            }
              .PhoneInputInput:focus {
              outline: none;
          }
              .PhoneInputInput{
              padding-left: 10px;
              }
          `}
        </style>
      </Head>

      <div className="min-h-screen flex flex-wrap items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Login
            </h2>
            <p className="mt-2 text-center text-sm text-white">
              We&apos;ll send you a verification code
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

          {show && (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="phone" className="sr-only">
                  Phone number
                </label>

                <div className='bg-[#1E1E1E] rounded-md shadow-sm px-5 py-3 text-sm border-2 border-solid border-[#444444]'>
                  <PhoneInput
                    value={phone}
                    placeholder="Mobile Number"
                    onChange={setPhone}
                    defaultCountry="US"
                    error={phone ? (isValidPhoneNumber(phone) ? undefined : 'Invalid phone number') : 'Phone number required'}
                    className='w-full bg-[#1E1E1E] text-white placeholder:text-white focus:outline-none focus:ring-0 focus:border-[#444444] border-0'
                  />

                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending code...
                    </span>
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
              <div className="text-sm text-center">
                <Link href="/auth/register" className="font-medium text-white-200 hover:text-white">
                  New user? click her to Register
                </Link>
              </div>
            </form>
          )}
        </div>
        <div className="mt-6 text-center position-absolute bottom-0 w-full">
          <p className="text-sm text-white-200">Need help? Visit our <Link href="/help" className="text-white-200 font-bold hover:text-white">help center</Link></p>
        </div>
      </div>
    </>
  );
}
