
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

 
export default function Register() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(true);
  const [agreeTOS, setAgreeTOS] = useState(false);
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

  const handleRegister = async (e: React.FormEvent) => {
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
      const encodedPhone = encodeURIComponent(phone);

      // Check if user exists in users table
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users?phone=${encodedPhone}`);
      const { data: existingUser } = await res.json();

      if (existingUser) {
        setError(<>
          This phone number is already registered. Please login instead.<br />
          <Link href="/auth/login">Click here to Login.</Link>
        </>);
        setShow(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: { data: { display_name: name } }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setError(<>
            This phone number is already registered. Please login instead.<br />
            <Link href="/auth/login">Click here to Login.</Link>
          </>);
          setShow(false);
          return;
        }
        if (error.message.includes('Invalid parameter')) {
          setError('Please enter a valid phone number in international format (e.g. +1234567890)');
          return;
        }
        throw error;
      }

      // Pass phone number to verify page and store in session
      sessionStorage.setItem('registrationPhone', phone);
      router.push(`/auth/verify?phone=${encodedPhone}`);
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
            <h2 className="text-center text-3xl font-bold text-white">
              Register 
            </h2>
            <p className="mt-2 text-center text-white-200">
              Enter your phone number to get started
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
            <form onSubmit={handleRegister} className="mt-8 space-y-6" id='registerForm'>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Display Name"
                className="w-full px-5 py-2 border-2 border-solid border-[#444444] rounded-md bg-[#1E1E1E] text-white placeholder:text-white-200 focus:outline-none focus:ring-0 focus:border-[#444444] text-sl"
                required
              /><br />


              <div className='bg-[#1E1E1E] rounded-md shadow-sm px-5 py-2 text-sl border-2 border-solid border-[#444444]'>
                <PhoneInput
                  value={phone}
                  placeholder="Mobile Number"
                  onChange={setPhone}
                  defaultCountry="US"
                  error={phone ? (isValidPhoneNumber(phone) ? undefined : 'Invalid phone number') : 'Phone number required'}
                  className='w-full bg-[#1E1E1E] text-white focus:outline-none focus:ring-0 focus:border-[#444444] border-0 placeholder:text-white'
                />

              </div>
              
              <label className="flex items-center gap-2 text-sl text-white-200">
                <input
                  type="checkbox"
                  checked={agreeTOS}
                  onChange={(e) => setAgreeTOS(e.target.checked)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                I agree with terms and conditions
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Sending code...' : 'Send verification code'}
              </button>
              <div className="text-sm text-center">
                <Link href="/auth/login" className="font-medium text-white-200 hover:text-white">
                  Have an account? Click here to Login
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
