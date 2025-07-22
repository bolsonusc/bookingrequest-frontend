import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/hooks/useAuth';
import Link from 'next/link';
import Head from 'next/head';
import { format } from 'date-fns';
import { ChevronRight, Calendar, Users, FilePlus, CalendarPlus2 } from 'lucide-react';
import { UserInfo } from '../../components/provider/user-info';
import { BookingCard } from '../../components/provider/booking-card';
import { InvoiceCard } from '../../components/provider/invoice-card';
import { QueckAction } from '../../components/settings/quick-action-card';

const Provider = () => {

  const router = useRouter();
  const { loading, user } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [activeBookings, setActiveBookings] = useState<BookingInfo[]>([]);
  const [pendingBookings, setPendingBookings] = useState<BookingInfo[]>([]);


  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    const fetchBookings = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        // Handle case where token is missing even if user object exists (e.g., corrupted session)
        router.push('/auth/login');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/status/active`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*' // Often handled by CORS on the server
          }
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch active bookings: ${res.status}`);
        } else {
          setPageLoading(false);
          const data = await res.json();

          setActiveBookings(data || []);
        }

      } catch (error) {
        console.error('Error fetching bookings:', error);
        // Potentially redirect or show an error state
      }



      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/status/pending`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*' // Often handled by CORS on the server
          }
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch active bookings: ${res.status}`);
        } else {
          setPageLoading(false);
          const data = await res.json();

          setPendingBookings(data || []);
        }

      } catch (error) {
        console.error('Error fetching bookings:', error);
        // Potentially redirect or show an error state
      }



    };

    // Fetch active Pending

    fetchBookings();


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
          <div className="mt-8 mb-4">
            <h3 className="text-xl font-normal text-white">Quick Actions</h3>
            <div className='grid grid-cols-4 gap-4'>
              <QueckAction
                title="Availability"
                link="/settings/availability"
                icon={<Calendar size={25} color='#fff' className='m-auto' />}
              />
              <QueckAction
                title="Booking"
                link="/provider/bookings/create"
                icon={<CalendarPlus2 size={25} color='#fff' className='m-auto' />}
              />
              <QueckAction
                title="Contact"
                link="/provider/bookings/create"
                icon={<Users size={25} color='#fff' className='m-auto' />}
              />
              <QueckAction
                title="Invoice"
                link="/provider/bookings/create"
                icon={<FilePlus size={25} color='#fff' className='m-auto' />}
              />
            </div>
          </div>
          <div>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="text-xl font-normal text-white">Upcoming Approved</h3>
              <Link href="/provider/bookings" className="text-blue-500 hover:text-blue-700">
                View All
              </Link>
            </div>


            {activeBookings.length > 0 ? (
              activeBookings.map((booking, index) => (
                console.log(booking),
                <BookingCard
                  key={index}
                  info={{
                    title: booking.title,
                    date: format(new Date(booking.date), 'yyyy-MM-dd'),
                    time: booking.start_time,
                    note: booking.notes,
                    paymentStatus: booking.paymentStatus,
                    status: booking.status,
                    with: booking.client.user.display_name,
                    invoice: booking.invoice,
                    amount: booking.amount
                  }}
                  user={user}
                />
              ))
            ) : (
              <div className="bg-[#16171A] rounded-lg px-12 py-5 flex flex-col gap-4 my-4 border border-[#2E2F31] relative cursor-pointer text-center text-white">                No upcoming approved bookings.
              </div>
            )}

            {/* <BookingCard
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
            /> */}
          </div>
          <div>
            <div className="mt-15 flex items-center justify-between">
              <h3 className="text-xl font-normal text-white">Pending Requests</h3>
              <Link href="/provider/bookings" className="text-blue-500 hover:text-blue-700">
                View All
              </Link>
            </div>

            {pendingBookings.length > 0 ? (
              pendingBookings.map((booking, index) => (
                <BookingCard
                  key={index}
                  info={{
                    title: booking.title,
                    date: format(new Date(booking.date), 'yyyy-MM-dd'),
                    time: booking.start_time,
                    note: booking.notes,
                    paymentStatus: booking.paymentStatus,
                    status: booking.status,
                    with: booking.client.user.display_name,
                    invoice: booking.invoice,
                    amount: booking.amount
                  }}
                  user={user}
                />
              ))
            ) : (
              <div className="bg-[#16171A] rounded-lg px-12 py-5 flex flex-col gap-4 my-4 border border-[#2E2F31] relative cursor-pointer text-center text-white">
                No pending requests.
              </div>
            )}
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