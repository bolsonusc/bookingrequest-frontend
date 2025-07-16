import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/hooks/useAuth';
import Link from 'next/link';
import Head from 'next/head';
import { BookingCard } from '../../components/client/booking-card';
import { InvoiceCard } from '../../components/client/invoice-card';
import { Calendar, Settings2 } from 'lucide-react';

const Client = () => {

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

    if (user && user?.role === 'provider') {
      router.push('/dashboard/provider');
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
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Service Provider Dashboard</title>
        <meta name="description" content="Authentication system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className='container mx-xl m-auto '>

          <header className=" py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/dashboard/profile/">
                <span className="w-15 h-15 rounded-full bg-[#22252A]  flex items-center justify-center text-white text-m">
                  {user?.display_name?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || 'U'}
                </span>
              </a>
              <div>
                <h1 className="text-xl font-semibold text-white capitalize">{user?.display_name || user?.email || 'User'} </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="/provider/calendar">
                <span className="w-12 h-12 rounded-full flex items-center justify-center text-white text-m border border-[#ABB0BA80] hover:border-blue-600 hover:bg-blue-600 transition-all duration-200">
                  <Calendar size={20} />
                </span>
              </a>
              <a href="/settings">
                <span className="w-12 h-12 rounded-full flex items-center justify-center text-white text-m border border-[#ABB0BA80] hover:border-blue-600 hover:bg-blue-600 transition-all duration-200">
                  <Settings2 size={20} />
                </span>
              </a>
            </div>

          </header>
          <div className="p-4 bg-[#16171A] rounded-lg shadow-lg border border-[#22252A]">
            <div className="mt-4 text-center">
              <h3 className="text-xl font-normal text-white mb-1">Upcoming Approved</h3>
              <p className="text-sm text-light text-white-200">Your next Scheduled appointments</p>
            </div>

            <BookingCard
              info={{
                title: 'Website Design Consultation1',
                date: '2023-10-01',
                time: '15:00',
                note: 'Want to discuss website redesign for my company',
                paymentStatus: 'paid',
                status: 'approved',
                with: 'Emma Wilson',
                invoice: 'INV-007',
                amount: '$150.00'
              }}
              user={user}
            />
          </div>

          <div className="p-4 mt-10 bg-[#16171A] rounded-lg shadow-lg border border-[#22252A]">
            <div className="mt-4 text-center">
              <h3 className="text-xl font-normal text-white mb-1">Recent Invoices</h3>
              <p className="text-sm text-light text-white-200">Your recent invoice history</p>
            </div>

            <InvoiceCard
              info={{
                date: '2023-10-01',
                status: 'unpaid',
                with: 'Emma Wilson',
                invoice: 'INV-007',
                amount: '$150.00',
                email: 'sdfokf@gmail.com',
                time: '15:00',
                title: 'Website Design Consultation',
                duration: '1 hour'
              }}
              user={user}
            />

            <InvoiceCard
              info={{
                date: '2023-10-01',
                status: 'paid',
                with: 'Emma Wilson',
                invoice: 'INV-007',
                amount: '$150.00',
                email: 'sdfokf@gmail.com',
                time: '15:00',
                title: 'Website Design Consultation',
              }}
              user={user}
            />
          </div>

        </div>


      </div>
    </>
  )
}

export default Client