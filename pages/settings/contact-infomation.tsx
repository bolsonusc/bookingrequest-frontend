import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../src/hooks/useAuth';

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
                <header className="h-[65px] w-screen sticky top-0 backdrop-blur-xs bg-[#0B0C0ECC] border-b-1 border-gray flex flex-row items-center justify-center text-center">
                    <button className='basis-2/100 w-8 cursor-pointer' onClick={() => router.back()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" strokeWidth={2} stroke="#fff" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7-7m-7 7l7 7" />
                        </svg>
                    </button>
                    <p className='font-normal text-lg leading-7 text-white-950 basis-90/100'>Contact Information</p>
                </header>

                {/* ===== MAIN PAGE ===== */}
                <div className='bg-black-950 flex flex-col mx-auto justify-center w-[40vw] p-4 rounded-xl'>

                    <div className=' text-[13px] text-white-250 p-4 rounded-xl mb-4 text-center'>
                        Update your private contact information. This information is not visible to
                        clients and is only used for account-related communications.
                    </div>

                    <form className='flex flex-col '>
                        <label className='text-white text-sm  flex items-center gap-2 mb-2' htmlFor='email'>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.334 2.66667H2.66732C1.93094 2.66667 1.33398 3.26363 1.33398 4.00001V12C1.33398 12.7364 1.93094 13.3333 2.66732 13.3333H13.334C14.0704 13.3333 14.6673 12.7364 14.6673 12V4.00001C14.6673 3.26363 14.0704 2.66667 13.334 2.66667Z" stroke="#ABB0BA" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.6673 4.66667L8.68732 8.46667C8.4815 8.59562 8.24353 8.66401 8.00065 8.66401C7.75777 8.66401 7.5198 8.59562 7.31398 8.46667L1.33398 4.66667" stroke="#ABB0BA" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            Email Address
                        </label>

                        <input
                            type='email'
                            value={user?.email || email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full bg-transparent text-white placeholder:text-white-200 focus:outline-none focus:ring-0 focus:border-[#444444] border-1 border-solid border-[#22252A] rounded-md px-5 py-3 text-sm '
                            placeholder='Enter your email address'
                            id='email'
                            name='email'
                        />



                        <label className='text-white text-sm  flex items-center gap-2 mt-5 mb-2' htmlFor='phoneNumber'>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.6669 11.28V13.28C14.6677 13.4657 14.6297 13.6495 14.5553 13.8196C14.4809 13.9897 14.3718 14.1424 14.235 14.2679C14.0982 14.3934 13.9367 14.489 13.7608 14.5485C13.5849 14.608 13.3985 14.6301 13.2136 14.6133C11.1622 14.3904 9.19161 13.6894 7.46028 12.5667C5.8495 11.5431 4.48384 10.1775 3.46028 8.56668C2.3336 6.82748 1.63244 4.84734 1.41361 2.78668C1.39695 2.60233 1.41886 2.41652 1.47795 2.2411C1.53703 2.06567 1.63199 1.90447 1.75679 1.76776C1.88159 1.63105 2.03348 1.52182 2.20281 1.44703C2.37213 1.37224 2.55517 1.33352 2.74028 1.33335H4.74028C5.06382 1.33016 5.37748 1.44473 5.62279 1.6557C5.8681 1.86667 6.02833 2.15964 6.07361 2.48001C6.15803 3.12006 6.31458 3.7485 6.54028 4.35335C6.62998 4.59196 6.64939 4.85129 6.59622 5.1006C6.54305 5.34991 6.41952 5.57875 6.24028 5.76001L5.39361 6.60668C6.34265 8.27571 7.72458 9.65764 9.39361 10.6067L10.2403 9.76001C10.4215 9.58077 10.6504 9.45725 10.8997 9.40408C11.149 9.35091 11.4083 9.37032 11.6469 9.46001C12.2518 9.68571 12.8802 9.84227 13.5203 9.92668C13.8441 9.97237 14.1399 10.1355 14.3513 10.385C14.5627 10.6345 14.6751 10.9531 14.6669 11.28Z" stroke="#ABB0BA" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            Phone Number</label>

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
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.6333 2C10.985 2.00501 11.3205 2.14878 11.5667 2.4L14.1 4.93333C14.3512 5.17951 14.495 5.51497 14.5 5.86667V12.6667C14.5 13.0203 14.3595 13.3594 14.1095 13.6095C13.8594 13.8595 13.5203 14 13.1667 14H3.83333C3.47971 14 3.14057 13.8595 2.89052 13.6095C2.64048 13.3594 2.5 13.0203 2.5 12.6667V3.33333C2.5 2.97971 2.64048 2.64057 2.89052 2.39052C3.14057 2.14048 3.47971 2 3.83333 2H10.6333Z" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M11.8327 14V9.33332C11.8327 9.15651 11.7624 8.98694 11.6374 8.86192C11.5124 8.73689 11.3428 8.66666 11.166 8.66666H5.83268C5.65587 8.66666 5.4863 8.73689 5.36128 8.86192C5.23625 8.98694 5.16602 9.15651 5.16602 9.33332V14" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M5.16602 2V4.66667C5.16602 4.84348 5.23625 5.01305 5.36128 5.13807C5.4863 5.2631 5.65587 5.33333 5.83268 5.33333H10.4993" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Save Contact Information
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default ContactInformation;