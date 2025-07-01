import React, { useState } from 'react'
import Image from 'next/image';


export const BookingCard = ({ user, info }) => {
    let statusClass = 'gray-500'; // default
    let mainstatusClass = 'bg-gray-600'; // default

    if (info.paymentStatus === 'paid') {
        statusClass = 'green-400';
        mainstatusClass = 'bg-green-500';
    } else if (info.paymentStatus === 'unpaid') {
        statusClass = 'amber-400';
        mainstatusClass = 'bg-amber-400';
    } else if (info.paymentStatus === 'cancelled') {
        statusClass = 'red-500';
        mainstatusClass = 'bg-red-500';
    }

    const [showPopup, setShowPopup] = useState(false);
    const infoclick = () => {
        setShowPopup(true);

    }
    const closePopup = () => {
        // Handle close popup event
        setShowPopup(false);
    }

    const [showInvoicePopup, setShowInvoicePopup] = useState(false);
    const invoiceClick = () => {
        setShowInvoicePopup(true);
    }
    const closeInvoicePopup = () => {
        // Handle close invoice popup event
        setShowInvoicePopup(false);
    }


    return (
        <>
            <div
                className='bg-[#16171A] rounded-lg px-12 py-5 flex flex-col gap-4 my-4 border border-[#2E2F31] relative cursor-pointer'
                onClick={infoclick}
            >
                <div className='flex items-center justify-between'>
                    <div className={`w-[8px] h-[8px] rounded-full ${mainstatusClass} absolute top-5 left-5`}></div>
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
                                    <button className='bg-yellow-500 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-yellow-600' onClick={invoiceClick}>
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

            {showInvoicePopup  && (
                <div className='fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] z-50'>
                    <div className='relative bg-[#16171A] w-[600px] rounded-lg  px-10 py-6 flex flex-col  my-4 border border-[#2E2F31] transform transition-all duration-300 scale-95 animate-fadeIn'>

                        <button
                            onClick={closeInvoicePopup}
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
                                    {info?.paymentStatus}
                                </span>
                            </p>
                        </div>
                        <hr className='my-4 border-gray-700' />
                        <div className='mt-2'>


                            <button className='bg-blue-600 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-700'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-link h-4 w-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                Share URL
                            </button>

                            <button className='bg-red-500 border border-[#2E2F31] mt-2 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-red-600'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-refresh-ccw h-4 w-4"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>
                                Refund Invoice
                            </button>

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