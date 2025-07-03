import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/hooks/useAuth';
import Link from 'next/link';
import Head from 'next/head';
import { UserInfo } from '../../components/provider/user-info';
import { BookingCard } from '../../components/provider/booking-card';
import { InvoiceCard } from '../../components/provider/invoice-card';

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

          <UserInfo user={user} />
          <div>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="text-xl font-normal text-white">Upcoming Approved</h3>
              <Link href="/provider/bookings" className="text-blue-500 hover:text-blue-700">
                View All
              </Link>
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
          <div>
            <div className="mt-15 flex items-center justify-between">
              <h3 className="text-xl font-normal text-white">Pending Requests</h3>
              <Link href="/provider/bookings" className="text-blue-500 hover:text-blue-700">
                View All
              </Link>
            </div>

            <BookingCard
              info={{
                title: 'Website Design Consultation2',
                date: '2023-10-01',
                time: '15:00',
                paymentStatus: 'paid',
                status: 'pending',
                with: 'Emma Wilson',
                invoice: 'INV-007',
                note: ''
              }}
              user={user}
            />

            <BookingCard
              info={{
                title: 'Website Design Consultation3',
                date: '2023-10-01',
                time: '15:00',
                paymentStatus: 'paid',
                status: 'pending',
                with: 'Emma Wilson',
                invoice: 'INV-007'
              }}
              user={user}
            />
          </div>
          <div>
            <div className="mt-15 flex items-center justify-between">
              <h3 className="text-xl font-normal text-white">Recent Invoice</h3>
              <Link href="/provider/bookings" className="text-blue-500 hover:text-blue-700">
                View All
              </Link>
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

export default Provider