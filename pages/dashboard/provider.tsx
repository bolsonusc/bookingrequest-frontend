import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/hooks/useAuth';
import Link from 'next/link';
import Head from 'next/head';
import { UserInfo } from '../../components/provider/user-info';

const Provider = () => {

  const router = useRouter();
  const { loading, user } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user) {
      setPageLoading(false);
    }

    if (user && user?.role === 'client') {
      router.push('/dashboard/client');
      return;
    }
  }, [user, loading, router]);

  const logout = async () => {
    // await supabase.auth.signOut();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    router.push('/auth/login');
  }

  if (pageLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  console.log('User:', user);

  return (
    <>
      <Head>
        <title>Service Provider Dashboard</title>
        <meta name="description" content="Authentication system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className='container mx-xl m-auto '>

          <UserInfo user={user} />
      <button onClick={logout} className='text-white'>Logout</button>

        </div>
      </div>
    </>
  )
}

export default Provider