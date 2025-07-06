
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';


export default function Verify() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { phone: queryPhone } = router.query;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!queryPhone) {
      setError('Phone number is required');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
          phone: queryPhone.toString(),
          token: otp
        }),
        headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const {error : verificationError,  user, token, refreshToken} = await res.json();

      if (verificationError) {
        if (verificationError.includes('Invalid OTP')) {
          setError(<Link href={'/auth/login'}>
            Invalid verification code. Please try again. Or request a new one here.
            </Link>);
          return;
        }
        if (verificationError.includes('user not found')) {
          setError(<Link href={'/auth/register'}>
            This user does not exist. Please register here.
            </Link>);
          return;
        }
        if (verificationError.includes('Token not received')) {
          setError(<Link href={'/auth/login'}>
            OTP has expired. Please request a new one here.
            </Link>);
          return;
        }
        throw verificationError;
      }

      // store refresh token & token for future use
      sessionStorage.setItem('refreshToken', refreshToken);
      sessionStorage.setItem('token', token);

      if(user){
        if (!user.username) {
          router.push('/auth/success');
        } else if (!user.role) {
          router.push('/auth/role-select');
        } else if (!user.email) {
          router.push('/auth/2fa-security');
        } else if (user.username && user.role) {
          router.push(`/dashboard/${user?.role}`);
        }
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

      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="max-w-md w-full space-y-8 p-8">
          <div>
            <h2 className="text-white text-center text-3xl font-bold">Enter OTP</h2>
            <p className="mt-2 text-center text-white-200">
              An OTP has been sent to<br /> {queryPhone}
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="mt-8 space-y-6">
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
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Verifying...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
