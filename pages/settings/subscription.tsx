import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../src/hooks/useAuth';
import { ArrowLeft, Calendar } from 'lucide-react';

const Subscription = () => {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
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
            <Head>
                <title>Subscription</title>
                <meta name="description" content="Subscription" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="min-h-screen  bg-black ">
                {/* ===== HEADER BAR ===== */}
                <header className="w-[90vw] pb-5 pt-10 mx-auto border-b-1 border-gray flex flex-row items-center justify-center text-center">
                    <button className='basis-2/100 w-8 cursor-pointer' onClick={() => router.back()}>
                        <ArrowLeft size={20} color='white' />
                    </button>
                    <p className='font-normal text-lg leading-7 text-white-950 basis-90/100'>Subscription</p>
                </header>

                {/* ===== MAIN PAGE ===== */}
                <div className='bg-black-950 mt-5 flex flex-col mx-auto justify-center w-[83vw] p-2 rounded-xl'>
                    <p className='text-[#1D4FD7] text-m mb-1 flex items-center gap-2 cursor-pointer'>
                        <Calendar size={16} color='#1D4FD7' />
                        Subscription Status
                    </p>
                    <div className='flex flex-col gap-2 text-center border-1 border-[#22252A] p-4 rounded-lg mt-3'>
                        <p className='text-white text-sx'>
                            No Active Subscription
                        </p>
                        <p className='text-white text-xs'>
                            Subscribe for just $9.99/month to access premium features and remove limitations.
                        </p>
                    </div>
                    <a href='https://buy.stripe.com/4gw3cI5a0e1G7dW8wA' target='_blank' rel='noreferrer'>
                        <button className='bg-[#1D4FD7] text-white text-sm py-3 px-4 rounded-lg mt-5 w-full flex items-center justify-center gap-2 hover:bg-[#1A3BB5] transition-colors duration-200'>
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.8906 2H14.8906V6" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M7.55664 9.33333L14.89 2" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.8906 8.66667V12.6667C12.8906 13.0203 12.7501 13.3594 12.5001 13.6095C12.2501 13.8595 11.9109 14 11.5573 14H4.22396C3.87034 14 3.5312 13.8595 3.28115 13.6095C3.0311 13.3594 2.89063 13.0203 2.89062 12.6667V5.33333C2.89062 4.97971 3.0311 4.64057 3.28115 4.39052C3.5312 4.14048 3.87034 4 4.22396 4H8.22396" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                            Subscribe Now - $9.99/month
                        </button>
                    </a>
                </div>
            </div>
        </>
    );
}
export default Subscription;