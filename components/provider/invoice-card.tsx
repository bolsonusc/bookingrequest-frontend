import React, { useState } from 'react'
import Image from 'next/image';

export const InvoiceCard = ({ user, info }) => {
    let statusClass = 'gray-500'; // default

    if (info.status === 'paid') {
        statusClass = 'green-400';
    } else if (info.status === 'unpaid') {
        statusClass = 'amber-400';
    } else if (info.status === 'cancelled') {
        statusClass = 'red-500';
    }



    const [showPopup, setShowPopup] = useState(false);
    const infoclick = () => {
        setShowPopup(true);

    }
    const closePopup = () => {
        // Handle close popup event
        setShowPopup(false);
    }

    return (
        <>
            <div className='border border-[#2E2F31] rounded-lg px-7 py-5 flex  gap-4 my-4 justify-between'>
                <div className='text-center'>
                    <p className='text-white text-m '>
                        {info?.with}
                    </p>
                    <p className='text-white-200 text-sm mt-1'>
                        <span className={`text-${statusClass} font-light`}>
                            {info?.invoice}
                        </span> - {info?.date}
                    </p>
                </div>
                <div className='flex items-center'>
                    <p className='text-white text-right'>
                        {info?.amount}
                        <br />
                        <span className={`text-sm text-${statusClass} ml-2 uppercase`}>
                            {info?.status}
                        </span>
                    </p>


                    <button className='ml-6  p-2 rounded-md cursor-pointer hover:bg-blue-500' onClick={infoclick}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.389 8.77219C17.3644 8.71664 16.7688 7.39547 15.4448 6.07148C13.6807 4.30734 11.4525 3.375 8.99999 3.375C6.54749 3.375 4.31929 4.30734 2.55515 6.07148C1.23117 7.39547 0.632806 8.71875 0.611009 8.77219C0.579026 8.84413 0.5625 8.92198 0.5625 9.0007C0.5625 9.07943 0.579026 9.15728 0.611009 9.22922C0.635618 9.28477 1.23117 10.6052 2.55515 11.9292C4.31929 13.6927 6.54749 14.625 8.99999 14.625C11.4525 14.625 13.6807 13.6927 15.4448 11.9292C16.7688 10.6052 17.3644 9.28477 17.389 9.22922C17.421 9.15728 17.4375 9.07943 17.4375 9.0007C17.4375 8.92198 17.421 8.84413 17.389 8.77219ZM8.99999 13.5C6.83577 13.5 4.94507 12.7132 3.37992 11.1621C2.73771 10.5235 2.19134 9.7952 1.75781 9C2.19123 8.20472 2.73761 7.47645 3.37992 6.83789C4.94507 5.2868 6.83577 4.5 8.99999 4.5C11.1642 4.5 13.0549 5.2868 14.6201 6.83789C15.2635 7.4763 15.8111 8.20457 16.2457 9C15.7387 9.94641 13.5302 13.5 8.99999 13.5ZM8.99999 5.625C8.33248 5.625 7.67996 5.82294 7.12494 6.19379C6.56993 6.56464 6.13735 7.09174 5.8819 7.70844C5.62645 8.32514 5.55962 9.00374 5.68984 9.65843C5.82007 10.3131 6.14151 10.9145 6.61351 11.3865C7.08551 11.8585 7.68688 12.1799 8.34156 12.3102C8.99625 12.4404 9.67485 12.3735 10.2915 12.1181C10.9083 11.8626 11.4354 11.4301 11.8062 10.875C12.1771 10.32 12.375 9.66751 12.375 9C12.3741 8.10518 12.0182 7.24728 11.3855 6.61454C10.7527 5.98181 9.89481 5.62593 8.99999 5.625ZM8.99999 11.25C8.55499 11.25 8.11997 11.118 7.74996 10.8708C7.37995 10.6236 7.09156 10.2722 6.92126 9.86104C6.75097 9.4499 6.70641 8.9975 6.79323 8.56105C6.88004 8.12459 7.09433 7.72368 7.409 7.40901C7.72367 7.09434 8.12458 6.88005 8.56104 6.79323C8.9975 6.70642 9.4499 6.75097 9.86103 6.92127C10.2722 7.09157 10.6236 7.37996 10.8708 7.74997C11.118 8.11998 11.25 8.55499 11.25 9C11.25 9.59674 11.0129 10.169 10.591 10.591C10.169 11.0129 9.59673 11.25 8.99999 11.25Z" fill="white" />
                        </svg>

                    </button>


                </div>
            </div>
            {showPopup && (
                <div className='fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] z-50'>
                    <div className='relative bg-[#16171A] w-[600px] rounded-lg  px-10 py-6 flex flex-col  my-4 border border-[#2E2F31] transform transition-all duration-300 scale-95 animate-fadeIn'>

                        <button
                            onClick={closePopup}
                            className='absolute right-4 top-4 rounded-full  p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4 text-white">
                                <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                            </svg>
                        </button>
                        <h3 className='text-white text-xl font-medium mt-4'>Invoice Details</h3>

                        <p className='text-white-200 text-sm mt-2 text-center my-5'>
                            <span>Invoice ID:</span><br />
                            <span className={`text-base text-${statusClass} uppercase p-1.5 block`}>{info?.invoice}</span>
                            <span className='text-s mt-1'>{info?.date}</span>
                        </p>

                        <p className='text-white-200 text-sm mt-2'>Client</p>
                        <p className='text-white text-lg font-medium '>
                            {info?.with}
                        </p>
                        <p className='text-white-200 text-sm mt-1'>
                            {info?.email}
                        </p>

                        <p className='text-white-200 text-sm mt-8'>Service</p>
                        <p className='text-white text-base  '>
                            {info?.title} ({info?.date} - {info?.time})
                        </p>
                        <hr className='my-4 border-gray-700' />

                        <div className='flex justify-between'>
                            <p className='text-white-200 text-base'>Total Amount</p>
                            <p className='text-white text-lg font-medium text-right'>
                                {info?.amount}
                                <br />
                                <span className={`text-sm text-${statusClass} ml-2 uppercase `}>
                                    {info?.status}
                                </span>
                            </p>
                        </div>
                        <hr className='my-4 border-gray-700' />
                        <div className='mt-2'>
                            {info?.status === 'paid' ? (
                                <div>


                                    <button className='bg-blue-600 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-700'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-link h-4 w-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                        Share URL
                                    </button>

                                    <button className='bg-red-500 border border-[#2E2F31] mt-2 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-red-600'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-refresh-ccw h-4 w-4"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>
                                        Refund Invoice
                                    </button>

                                </div>
                            ) : info?.status === 'unpaid' ? (
                                <div>
                                    <button className='bg-indigo-500 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-indigo-600'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-send h-4 w-4"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>
                                        Resend Invoice
                                    </button>
                                    <button className='bg-blue-600 text-white mt-2  px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-700'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-link h-4 w-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                        Share URL
                                    </button>

                                </div>
                            ) : null}
                        </div>

                        <div className='mt-5'>
                            <ul className='text-white-200 text-sm flex  gap-3'>
                                <li className='w-full'>
                                    <a href="#" className='flex items-center gap-2 text-white border border-[#2E2F31] hover:bg-[#5275e0] px-4 py-2 rounded-lg  w-full justify-center'>
                                        <Image src="/download.svg" alt="Clock Icon" width={20} height={20} />
                                        Download
                                    </a>
                                </li>
                                <li className='w-full'>
                                    <a href="#" className='flex items-center gap-2 text-white border border-[#2E2F31] hover:bg-[#5275e0] px-4 py-2 rounded-lg  w-full justify-center'>
                                        <Image src="/copy.svg" alt="Clock Icon" width={16} height={16} />
                                        Copy
                                    </a>
                                </li>
                                <li className='w-full'>
                                    <a href="#" className='flex items-center gap-2 text-white border border-[#2E2F31] hover:bg-[#5275e0] px-4 py-2 rounded-lg  w-full justify-center'>
                                        <Image src="/edit.svg" alt="Clock Icon" width={16} height={16} />
                                        Edit
                                    </a>
                                </li>
                                <li className='w-full'>
                                    <a href="#" className='flex items-center gap-2 text-white border border-[#2E2F31] hover:bg-[#5275e0] px-4 py-2 rounded-lg  w-full justify-center' onClick={closePopup}>
                                        <Image src="/close.svg" alt="Clock Icon" width={20} height={20} />
                                        Close
                                    </a>
                                </li>
                                
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}