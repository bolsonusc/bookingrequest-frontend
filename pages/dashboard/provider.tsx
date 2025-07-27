import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/hooks/useAuth';
import Link from 'next/link';
import Head from 'next/head';
import { format } from 'date-fns';
import { ChevronRight, Calendar, Users, FilePlus, CalendarPlus2 } from 'lucide-react';
import { UserInfo } from '../../components/provider/user-info';
import { Skeleton } from '../../components/utils/Skeleton'
import { BookingCard } from '../../components/provider/booking-card';
import { InvoiceCard } from '../../components/provider/invoice-card';
import { QueckAction } from '../../components/settings/quick-action-card';

const Provider = () => {

  type BookingInfo = Record<string, any>;
  type InvoiceInfo = Record<string, any>;
  type ServiceInfo = Record<string, any>;

  const router = useRouter();
  const { loading, user } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [activeBookings, setActiveBookings] = useState<BookingInfo[]>([]);
  const [pendingBookings, setPendingBookings] = useState<BookingInfo[]>([]);
  const [invoices, setInvoices] = useState<InvoiceInfo[]>([]);
  const [services, setservices] = useState<ServiceInfo[]>([]);


  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (loading || hasFetched) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }
    setPageLoading(false);
    if (user?.role === 'client') {
      router.push('/dashboard/client');
      return;
    }

    const fetchBookings = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {

        const approvedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/status/approved`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*' // Often handled by CORS on the server
          }
        });
        const approvedData = await approvedRes.json();
        setActiveBookings(approvedData || []);

        const pendingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/status/pending`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*' // Often handled by CORS on the server
          }
        });
        const pendingData = await pendingRes.json();
        setPendingBookings(pendingData || []);

        const invoiceRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invoices`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*' // Often handled by CORS on the server
          }
        });
        const invoiceData = await invoiceRes.json();
        setInvoices(invoiceData || []);

        // get all service 
        const services = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*' // Often handled by CORS on the server
          }
        });
        const servicesData = await services.json();
        setservices(servicesData || []);




      } catch (err) {
        console.error(err);
      } finally {
        setShowSkeleton(false);
        setHasFetched(true); // ✅ Mark as fetched
      }
    };

    fetchBookings();
  }, [loading, user, hasFetched]);

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



            {showSkeleton && activeBookings.length == 0 ? (
              <>
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={`UpcomingApproved-${index}`} />
                ))}
              </>
            ) :

              activeBookings.length > 0 ? (
                activeBookings.map((booking, index) => (

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
                      amount: booking.amount,
                      id: booking.id
                    }}
                    user={user}
                  />
                ))
              ) : (
                <div className="bg-[#16171A] rounded-lg px-12 py-5 flex flex-col gap-4 my-4 border border-[#2E2F31] relative cursor-pointer text-center text-white">                No upcoming approved bookings.
                </div>
              )
            }




          </div>
          <div>
            <div className="mt-15 flex items-center justify-between">
              <h3 className="text-xl font-normal text-white">Pending Requests</h3>
              <Link href="/provider/bookings" className="text-blue-500 hover:text-blue-700">
                View All
              </Link>
            </div>


            {showSkeleton && pendingBookings.length == 0 ? (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={`PendingBooking-${index}`} />
                ))}
              </>
            ) : pendingBookings.length > 0 ? (
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
                    amount: booking.amount,
                    id: booking.id
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


            {
              showSkeleton && invoices.length == 0 ? (
                <>
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton key={`InvoiceCard-${index}`} />
                  ))}
                </>
              ) :
                invoices.length > 0 ? (
                  invoices.map((invoice, index) => (
                    <InvoiceCard
                      key={index}
                      info={{
                        title: services.find(service => service.id === invoice.service_id)?.name || 'Service Title',
                        date: invoice.date,
                        status: invoice.status,
                        with: invoice.client_name,
                        invoice: invoice.invoice_number,
                        amount: '$' + invoice.price,
                        email: invoice.client_email,
                        time: format(new Date(invoice.sent_date), 'HH:mm a'),
                        id: invoice.id,
                        notes: invoice.notes,
                        download_url: invoice.download_url,
                        share_url: invoice.share_url
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

export default Provider