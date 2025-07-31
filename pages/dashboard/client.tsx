import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/hooks/useAuth';
import Link from 'next/link';
import Head from 'next/head';
import { format } from 'date-fns';
import { BookingCard } from '../../components/client/booking-card';
import { InvoiceCard } from '../../components/client/invoice-card';
import { Skeleton } from '../../components/utils/Skeleton';
import { Calendar, Settings2 } from 'lucide-react';

const Client = () => {

  type BookingInfo = Record<string, any>;
  type InvoiceInfo = Record<string, any>;

  const router = useRouter();
  const { loading, user } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [upcomingBookings, setUpcomingBookings] = useState<BookingInfo[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<InvoiceInfo[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (loading || hasFetched) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
    setPageLoading(false);
    if (user?.role === 'provider') {
      router.push('/dashboard/provider');
      return;
    }

    const fetchData = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        // Fetch upcoming approved bookings
        const bookingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/status/approved`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*'
          }
        });
        const bookingsData = await bookingsRes.json();
        setUpcomingBookings(bookingsData || []);

        // Fetch recent invoices
        const invoicesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices/received`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*'
          }
        });
        const invoicesData = await invoicesRes.json();
        setRecentInvoices(invoicesData || []);

      } catch (err) {
        console.error(err);
      } finally {
        setShowSkeleton(false);
        setHasFetched(true);
      }
    };

    fetchData();
  }, [loading, user, hasFetched, router]);


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
        <title>Client Dashboard</title>
        <meta name="description" content="Client dashboard for booking management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-black py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
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
              <a href="/dashboard/calendar">
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

            {showSkeleton && upcomingBookings.length === 0 ? (
              <>
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={`upcoming-${index}`} />
                ))}
              </>
            ) : upcomingBookings.length > 0 ? (
              upcomingBookings.slice(0, 3).map((booking, index) => (
                <BookingCard
                  key={index}
                  info={{
                    title: booking.title || booking.service?.name || 'Booking',
                    date: format(new Date(booking.date), 'yyyy-MM-dd'),
                    time: booking.start_time,
                    note: booking.notes,
                    paymentStatus: booking.paymentStatus || 'pending',
                    status: booking.status,
                    with: booking.provider?.user?.display_name || booking.provider?.user?.username || 'Provider',
                    invoice: booking.invoice,
                    amount: booking.amount || '$0.00',
                    id: booking.id
                  }}
                  user={user}
                />
              ))
            ) : (
              <div className="bg-[#16171A] rounded-lg px-12 py-5 flex flex-col gap-4 my-4 border border-[#2E2F31] relative cursor-pointer text-center text-white">
                No upcoming approved bookings.
              </div>
            )}
          </div>

          <div className="p-4 mt-10 bg-[#16171A] rounded-lg shadow-lg border border-[#22252A]">
            <div className="mt-4 text-center">
              <h3 className="text-xl font-normal text-white mb-1">Recent Invoices</h3>
              <p className="text-sm text-light text-white-200">Your recent invoice history</p>
            </div>

            {showSkeleton && recentInvoices.length === 0 ? (
              <>
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={`invoice-${index}`} />
                ))}
              </>
            ) : recentInvoices.length > 0 ? (
              recentInvoices.slice(0, 3).map((invoice, index) => (
                <InvoiceCard
                  key={index}
                  info={{
                    date: invoice.date,
                    status: invoice.status,
                    with: invoice.provider?.user?.display_name || invoice.provider?.user?.username || 'Provider',
                    invoice: invoice.invoice_number,
                    amount: '$' + invoice.total,
                    email: invoice.provider?.user?.email || '',
                    time: invoice.sent_date ? format(new Date(invoice.sent_date), 'HH:mm a') : '',
                    title: invoice.service?.name || 'Service',
                    duration: invoice.duration || '1 hour',
                    id: invoice.id
                  }}
                  user={user}
                />
              ))
            ) : (
              <div className="bg-[#16171A] rounded-lg px-12 py-5 flex flex-col gap-4 my-4 border border-[#2E2F31] relative cursor-pointer text-center text-white">
                No recent invoices.
              </div>
            )}
          </div>

        </div>


      </div>
    </>
  )
}

export default Client