import React, { useState } from 'react'
import { Copy, Download, Eye, Link, RefreshCcw, Send, SquarePen, X } from 'lucide-react';

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
                        <Eye size={18} color='white' />
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
                            <X size={16} color='white'/>
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
                                        <Link size={16}/>
                                        Share URL
                                    </button>

                                    <button className='bg-red-500 border border-[#2E2F31] mt-2 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-red-600'>
                                        <RefreshCcw size={16} />
                                        Refund Invoice
                                    </button>

                                </div>
                            ) : info?.status === 'unpaid' ? (
                                <div>
                                    <button className='bg-indigo-500 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-indigo-600'>
                                        <Send size={16} />
                                        Resend Invoice
                                    </button>
                                    <button className='bg-blue-600 text-white mt-2  px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-700'>
                                        <Link  size={16}/>
                                        Share URL
                                    </button>

                                </div>
                            ) : null}
                        </div>

                        <div className='mt-5'>
                            <ul className='text-white-200 text-sm flex  gap-3'>
                                <li className='w-full'>
                                    <a href="#" className='flex items-center gap-2 text-white border border-[#2E2F31] hover:bg-[#5275e0] px-4 py-2 rounded-lg  w-full justify-center'>
                                        <Download size={18}/>
                                        Download
                                    </a>
                                </li>
                                <li className='w-full'>
                                    <a href="#" className='flex items-center gap-2 text-white border border-[#2E2F31] hover:bg-[#5275e0] px-4 py-2 rounded-lg  w-full justify-center'>
                                        <Copy size={16}/>
                                        Copy
                                    </a>
                                </li>
                                <li className='w-full'>
                                    <a href="#" className='flex items-center gap-2 text-white border border-[#2E2F31] hover:bg-[#5275e0] px-4 py-2 rounded-lg  w-full justify-center'>
                                        <SquarePen size={16} />
                                        Edit
                                    </a>
                                </li>
                                <li className='w-full'>
                                    <a href="#" className='flex items-center gap-2 text-white border border-[#2E2F31] hover:bg-[#5275e0] px-4 py-2 rounded-lg  w-full justify-center' onClick={closePopup}>
                                        <X size={18} />
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