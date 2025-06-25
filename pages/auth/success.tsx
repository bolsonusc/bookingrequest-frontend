
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/hooks/useAuth';
import Image from 'next/image';

export default function Success() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);

  const [seconds, setSeconds] = useState(5);
  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user) {
      setPageLoading(false);
    }

    const timer = setTimeout(async () => {
      router.push('/auth/onboarding');
    }, 6000);

    return () => clearTimeout(timer);
  }, [user, loading, router]);

  if (pageLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-wrap items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <h2 className="mt-6 mb-2 text-center text-3xl font-extrabold text-white">
          {/* You&apos;ve selected your role! */}
          Registration Successful!
        </h2>
        <p className=" text-center text-sm text-white-200">
          You will be redirected to the landing page in
          <span className="font-bold text-white">
            {seconds > 0 ? ` ${seconds} ` : "Click below to continue"}
          </span>
          seconds.
        </p>
        <Image
          src="/register-img.png"
          alt="Registration Success"
          width={300}
          height={0}
          style={{ height: 'auto' }}

          className="block my-2 mx-auto"
        />
        <p className="text-white text-sm mt-4">
          Click <strong className='text-indigo-500' onClick={() => router.push('/auth/onboarding')}>here</strong> if you not redirected automatically
        </p>
      </div>
    </div>
  );
}
