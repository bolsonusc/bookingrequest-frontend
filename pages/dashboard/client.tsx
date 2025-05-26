import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/hooks/useAuth';
import Link from 'next/link';

const Client = () => {

  const router = useRouter();
  const { supabase, loading, user } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (!loading && user) {
      setPageLoading(false);
    }

    if(user && user?.user_metadata?.role === 'provider'){
      router.push('/dashboard/provider');
      return;
    }

  }, [user, loading, router]);

  const logout = async() => {
    await supabase.auth.signOut();
    router.push('/auth/login');
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
      <h2>Client</h2>
      <p><Link href={'/settings'}>Update User (setting)</Link></p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Client