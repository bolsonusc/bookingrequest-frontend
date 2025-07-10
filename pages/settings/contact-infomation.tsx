import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../src/hooks/useAuth';
import { ArrowLeft, Mail, Phone, Save } from 'lucide-react';

const ContactInformation = () => {

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
                <title>Contact Information</title>
                <meta name="description" content="Contact Information" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="min-h-screen  bg-black ">
                {/* ===== HEADER BAR ===== */}
                <header className="w-[90vw] pb-5 pt-10 mx-auto border-b-1 border-gray flex flex-row items-center justify-center text-center">
                    <button className='basis-2/100 w-8 cursor-pointer' onClick={() => router.back()}>
                        <ArrowLeft size={20} color='white'/>
                    </button>
                    <p className='font-normal text-lg leading-7 text-white-950 basis-90/100'>Contact Information</p>
                </header>

                {/* ===== MAIN PAGE ===== */}
                <div className='bg-black-950 mt-10 flex flex-col mx-auto justify-center w-[40vw] p-4 rounded-xl'>

                    <div className=' text-[13px] text-white-250 p-4 rounded-xl mb-4 text-center'>
                        Update your private contact information. This information is not visible to
                        clients and is only used for account-related communications.
                    </div>

                    <form className='flex flex-col text-white-950'>
                        <label className='text-sm flex items-center gap-2 mb-2' htmlFor='email'>
                            <Mail size={16} color='#ABB0BA'/>
                            Email Address
                        </label>

                        <input
                            type='email'
                            value={user?.email || email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full bg-transparent placeholder:text-white-200 focus:outline-none focus:ring-0 focus:border-[#444444] border-1 border-solid border-[#22252A] rounded-md px-5 py-3 text-sm '
                            placeholder='Enter your email address'
                            id='email'
                            name='email'
                        />

                        <label className='text-white text-sm  flex items-center gap-2 mt-5 mb-2' htmlFor='phoneNumber'>
                            <Phone size={16} color='#ABB0BA'/>
                            Phone Number
                        </label>

                        <input
                            type='tel'
                            value={user?.phone || phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className='w-full bg-transparent text-white placeholder:text-white-200 focus:outline-none focus:ring-0 focus:border-[#444444] border-1 border-solid border-[#22252A] rounded-md px-5 py-3 text-sm'
                            placeholder='Enter your phone number'
                            id='phoneNumber'
                            name='phoneNumber'
                            pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
                        />

                        <p className=' text-[13px] text-white-250 p-4 rounded-xl mb-1 text-center'>
                            Add your phone number for account security and notifications.
                        </p>
                        <button
                            type='submit'
                            className='bg-[#1D4FD7] rounded border-1 border-[#1D4FD7] px-4 py-3 text-[13px] cursor-pointer mt-2  text-white flex items-center gap-2  justify-center'
                        >
                            <Save size={16} />
                            Save Contact Information
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default ContactInformation;