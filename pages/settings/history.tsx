
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../src/hooks/useAuth';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import NavigateButton from '../../components/settings/NavigateButton';
import { ArrowLeft, Clock, Funnel, ChevronLeft, ChevronRight } from 'lucide-react';
import { BookingCard } from '../../components/provider/booking-card';
import { Skeleton } from '../../components/utils/Skeleton';
import { format } from 'date-fns';

export default function History() {

    type BookingInfo = Record<string, any>;

    const router = useRouter();
    const { loading, user } = useAuth();
    const [pageLoading, setPageLoading] = useState(true);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [allBookings, setAllBookings] = useState<BookingInfo[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingInfo[]>([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [hasFetched, setHasFetched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const ITEMS_PER_PAGE = 10;

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
                const allBookingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                        'Access-Control-Allow-Origin': '*'
                    }
                });
                const response = await allBookingsRes.json();
                
                setAllBookings(response || []);

            } catch (err) {
                console.error(err);
            } finally {
                setShowSkeleton(false);
                setHasFetched(true);
            }
        };

        fetchBookings();
    }, [loading, user, hasFetched, router]);

    // Client-side filtering and pagination
    useEffect(() => {
        let filtered = allBookings;
        
        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = allBookings.filter(booking => booking.status === filterStatus);
        }
        
        // Set total count for pagination
        setTotalCount(filtered.length);
        
        // Apply pagination
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedBookings = filtered.slice(startIndex, endIndex);
        
        setFilteredBookings(paginatedBookings);
    }, [allBookings, filterStatus, currentPage, ITEMS_PER_PAGE]);

    // Handle filter change
    const handleFilterChange = (newStatus: string) => {
        setFilterStatus(newStatus);
        setCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };



    if (pageLoading || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className='bg-[#0B0C0E] text-white flex flex-col items-center w-full min-h-screen'>
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
                        {totalCount} Appointments
                    </span>
                </div>
                <div className='flex items-center'>
                    <Funnel size={20} className='text-white-200' />
                    <select 
                        className='ml-2 bg-transparent border border-[#22252A] text-white-950 rounded-md p-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary' 
                        value={filterStatus}
                        onChange={(e) => handleFilterChange(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="declined">Declined</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="finished">Finished</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className='w-[85vw] '>
                {showSkeleton && filteredBookings.length === 0 ? (
                    <>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={`history-${index}`} />
                        ))}
                    </>
                ) : filteredBookings.length > 0 ? (
                    <>
                        {filteredBookings.map((booking, index) => (
                            <BookingCard
                                key={index}
                                info={{
                                    title: booking.title,
                                    date: format(new Date(booking.date), 'yyyy-MM-dd'),
                                    time: booking.start_time,
                                    note: booking.notes,
                                    paymentStatus: booking.paymentStatus,
                                    status: booking.status,
                                    with: booking.client?.user?.display_name || 'N/A',
                                    invoice: booking.invoice,
                                    amount: booking.amount,
                                    id: booking.id
                                }}
                                user={user}
                            />
                        ))}
                        
                        {/* Pagination Controls */}
                        {totalCount > ITEMS_PER_PAGE && (
                            <div className="flex justify-center items-center mt-8 mb-4 gap-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center px-4 py-2 bg-[#16171A] border border-[#2E2F31] rounded-lg text-white-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#22252A] transition-colors"
                                >
                                    <ChevronLeft size={16} className="mr-1" />
                                    Previous
                                </button>
                                
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.ceil(totalCount / ITEMS_PER_PAGE) }, (_, i) => i + 1)
                                        .filter(page => 
                                            page === 1 || 
                                            page === Math.ceil(totalCount / ITEMS_PER_PAGE) || 
                                            Math.abs(page - currentPage) <= 1
                                        )
                                        .map((page, index, arr) => (
                                            <React.Fragment key={page}>
                                                {index > 0 && arr[index - 1] !== page - 1 && (
                                                    <span className="text-white-200 px-2">...</span>
                                                )}
                                                <button
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                                        currentPage === page
                                                            ? 'bg-primary text-white'
                                                            : 'bg-[#16171A] border border-[#2E2F31] text-white-200 hover:bg-[#22252A]'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            </React.Fragment>
                                        ))
                                    }
                                </div>
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(totalCount / ITEMS_PER_PAGE)}
                                    className="flex items-center px-4 py-2 bg-[#16171A] border border-[#2E2F31] rounded-lg text-white-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#22252A] transition-colors"
                                >
                                    Next
                                    <ChevronRight size={16} className="ml-1" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-[#16171A] rounded-lg px-12 py-5 flex flex-col gap-4 my-4 border border-[#2E2F31] relative cursor-pointer text-center text-white">
                        No booking history found.
                    </div>
                )}
            </div>

        </div>
    );
}

