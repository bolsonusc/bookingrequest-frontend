
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../src/hooks/useAuth';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import NavigateButton from '../../components/settings/NavigateButton';
import { ArrowLeft, Clock, Funnel } from 'lucide-react';
import { BookingCard } from '../../components/provider/booking-card';

export default function History() {

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



    if (pageLoading || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className='bg-[#0B0C0E] text-white flex flex-col items-center w-full '>
            <Head>
                <title>History</title>
                <meta name="description" content="History" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* ===== HEADER BAR ===== */}
            <header className="w-[90vw] pb-5 pt-10 mx-auto border-b-1 border-gray flex flex-row items-center justify-center text-center">
                <button className='basis-2/100 w-8 cursor-pointer mr-4' onClick={() => router.back()}>
                    <ArrowLeft size={20} color='white' />
                </button>
                <p className='font-normal text-lg leading-7 text-white-950 basis-90/100 text-left'>
                    Booking History
                    <span className='text-[13px] text-white-250 block'>
                        View your past appointments
                    </span>
                </p>
            </header>

            {/* ===== MAIN PAGE ===== */}
            <div className='flex justify-between items-center my-6 w-[85vw]  '>
                <div className='flex items-center'>
                    <Clock size={20} className='text-white-200' />
                    <span className='text-white-200 text-[13px] ml-2'>
                        5 Appointments
                    </span>
                </div>
                <div className='flex items-center'>
                    <Funnel size={20} className='text-white-200' />
                    <select className='ml-2 bg-transparent border border-[#22252A] text-white-950 rounded-md p-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary' defaultValue="all">
                        <option value="all">All</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className='w-[85vw] '>
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
                <BookingCard
                    info={{
                        title: 'Website Design Consultation4',
                        date: '2023-10-01',
                        time: '15:00',
                        paymentStatus: 'paid',
                        status: 'cancelled',
                        with: 'Emma Wilson',
                        invoice: 'INV-007'
                    }}
                    user={user}
                />
            </div>

        </div>
    );
}

