import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/hooks/useAuth';
import Head from 'next/head';
import { ArrowLeft, Clock, Funnel, Info } from 'lucide-react';


const Availability = () => {

    const router = useRouter();
    const { loading, user } = useAuth();
    const [pageLoading, setPageLoading] = useState(true);


    const [activeTab, setActiveTab] = useState('business_hours');
    const tabs = [
        { id: 'business_hours', label: 'Business Hours', description: 'Set specific start and end times for each day' },
        { id: 'day_parts', label: 'Day Parts', description: 'Choose morning, afternoon, evening, or night availability' },
    ];

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
        <>
            <div className='bg-[#0B0C0E] text-white flex flex-col items-center w-full '>

                <Head>
                    <title>Service Provider Dashboard</title>
                    <meta name="description" content="Authentication system" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                {/* ===== HEADER BAR ===== */}
                <header className="w-[90vw] pb-5 pt-10 mx-auto border-b-1 border-gray flex flex-row items-center justify-center text-center">
                    <button className='basis-2/100 w-8 cursor-pointer mr-4' onClick={() => router.back()}>
                        <ArrowLeft size={20} color='white' />
                    </button>
                    <p className='font-normal text-lg leading-7 text-white-950 basis-90/100 text-left'>Availability</p>
                </header>

                {/* ===== MAIN PAGE ===== */}
                <div className='flex flex-wrap justify-between items-center my-6 w-[85vw]'>
                    <div className='flex items-center gap-3 bg-[#22252a8f] p-4 rounded-lg w-full'>
                        <Info size={20} className='text-[#1D4FD7]' />
                        <p className='text-white-200'>Set your availability to let clients know when they can book your services.</p>
                    </div>

                    <p className='text-center w-full mt-10'>Availability Mode</p>
                </div>
            </div>
        </>
    )
}
export default Availability;