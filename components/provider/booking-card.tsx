import React, { useState } from 'react'
import Image from 'next/image';


export const BookingCard = ({ user, info }) => {
    let statusClass = 'bg-gray-500'; // default

    if (info.paymentStatus === 'paid') {
        statusClass = 'bg-green-500';
    } else if (info.paymentStatus === 'unpaid') {
        statusClass = 'bg-amber-400';
    } else if (info.paymentStatus === 'cancelled') {
        statusClass = 'bg-red-500';
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
            <div
                className='bg-[#16171A] rounded-lg px-12 py-5 flex flex-col gap-4 my-4 border border-[#2E2F31] relative cursor-pointer'
                onClick={infoclick}
            >
                <div className='flex items-center justify-between'>
                    <div className={`w-[8px] h-[8px] rounded-full ${statusClass} absolute top-5 left-5`}></div>
                    <h4 className='text-white text-m font-medium'>
                        {info?.title}
                        <span className='text-sm pl-10 pt-1 block font-normal text-white-200 '>
                            with {info?.with}
                        </span>
                    </h4>
                    <p className='text-sm text-amber-400'>{info?.invoice}</p>
                </div>
                <div className='flex flex-col '>
                    <p className='text-sm text-white-200 flex items-center gap-2 mb-3'>
                        <Image src="/calendar.svg" alt="Calendar Icon" width={18} height={18} />
                        {info?.date}
                    </p>
                    <p className='text-sm text-white-200 flex items-center gap-2'>
                        <Image src="/clock.svg" alt="Clock Icon" width={18} height={18} />
                        {info?.time}
                    </p>
                </div>

                {info?.note && info.note.trim() !== '' ? (
                    <div className='bg-[#1C1E22] rounded-lg px-6 py-4 text-center mt-2'>
                        <p className='text-white text-m'>Note:</p>
                        <p className='text-sm text-white-200 mt-1'>
                            {info?.note}
                        </p>
                    </div>
                ) : null}
            </div>

            {showPopup && (
                <div className='fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] z-50'>
                    <div className='relative bg-[#16171A] w-[450px] rounded-lg  p-6 flex flex-col gap-3 my-4 border border-[#2E2F31] transform transition-all duration-300 scale-95 animate-fadeIn'>

                        <button
                            onClick={closePopup}
                            className='absolute right-4 top-4 rounded-full  p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4 text-white">
                                <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                            </svg>
                        </button>


                        <h2 className='text-lg font-bold mb-0 text-white'>
                            <div className={`w-[8px] h-[8px] rounded-full ${statusClass} inline-block`}></div>&nbsp;&nbsp;&nbsp; {info?.title} </h2>
                        <p className='text-sm  block font-light pt-2 text-white-200'>with {info?.with}</p>

                        <div className='flex flex-col py-1.5'>
                            <p className='text-sm text-white-200 flex items-center gap-2 mb-2'>
                                <Image src="/calendar.svg" alt="Calendar Icon" width={18} height={18} />
                                {info?.date}
                            </p>
                            <p className='text-sm text-white-200 flex items-center gap-2'>
                                <Image src="/clock.svg" alt="Clock Icon" width={18} height={18} />
                                {info?.time}
                            </p>
                        </div>

                        {info?.note && info.note.trim() !== '' ? (
                            <div className='bg-[#1C1E22] rounded-lg p-3 mt-2'>
                                <p className='text-white text-sm'>Note:</p>
                                <p className='text-sm text-white-200 mt-1'>
                                    {info?.note}
                                </p>
                            </div>
                        ) : null}


                        <div className='mt-2'>
                            {info?.status === 'approved' ? (
                                <div>
                                    <button className='bg-yellow-500 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-yellow-600'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text h-4 w-4">
                                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                                            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                                            <path d="M10 9H8" />
                                            <path d="M16 13H8" />
                                            <path d="M16 17H8" />
                                        </svg>
                                        View Invoice ({info?.invoice})
                                    </button>

                                    <button className='bg-transparent border border-[#2E2F31] mt-2 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-600'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen h-4 w-4">
                                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                        </svg>
                                        Modify Appointment
                                    </button>
                                </div>
                            ) : info?.status === 'pending' ? (
                                <div>
                                    <button className='bg-blue-600 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-700'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check h-4 w-4"><path d="M20 6 9 17l-5-5"></path></svg>
                                        Accept Appointment
                                    </button>

                                    <button className='bg-transparent border border-[#2E2F31] mt-2 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-400'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen h-4 w-4">
                                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                        </svg>
                                        Edit Appointment
                                    </button>

                                    <button className='bg-red-500 border border-[#2E2F31] mt-2 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-red-600'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                                        Decline Appointment
                                    </button>

                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}