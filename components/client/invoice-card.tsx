import React, { useState } from 'react'
import { Copy, Download, Eye, Link, RefreshCcw, Send, SquarePen, X } from 'lucide-react';
import { format } from 'date-fns';

export const InvoiceCard = ({ user, info }) => {
    let statusClass = 'text-gray-500'; // default

    if (info.status === 'paid') {
        statusClass = 'text-green-400';
    } else if (info.status === 'unpaid') {
        statusClass = 'text-amber-400';
    } else if (info.status === 'cancelled') {
        statusClass = 'text-red-500';
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
                <div className=''>
                    <p className='text-white text-m '>
                        {info?.with}
                    </p>
                    <p className='text-white-200 text-sm mt-1'>

                        <span className={`${statusClass} font-light`}>
                            {info?.invoice}
                        </span> - {info?.date ? format(new Date(info?.date), 'dd MMM yyyy') : 'N/A'}
                    </p>
                </div>
                <div className='flex items-center'>
                    <p className='text-white text-right'>
                        {info?.amount}
                        <br />
                        <span className={`text-sm ${statusClass} ml-2 uppercase`}>
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
                    <div className='relative bg-[#0d0c0e] w-[450px] rounded-lg  p-5 flex flex-col  my-4 border border-[#2E2F31] transform transition-all duration-300 scale-95 animate-fadeIn'>

                        <button
                            onClick={closePopup}
                            className='absolute right-4 top-4 rounded-full  p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer'
                        >
                            <X size={16} color='white' />
                        </button>
                        <h3 className='text-white text-m font-medium '>Invoice Details</h3>
                        <div className="py-4 text-white">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Invoice #:</span>
                                    <span className="text-sm">
                                        {info?.invoice || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Date:</span>
                                    <span className="text-sm">
                                        {info?.date ? format(new Date(info?.date), 'dd MMM yyyy') : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Amount:</span>
                                    <span className="text-sm font-semibold">
                                        {info?.amount}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">Status:</span>
                                    <span className={`text-sm capitalize ${statusClass}`}>
                                        {info?.status || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="h-[1px] w-full my-4  bg-gray-600"></div>
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium">Items:</h4>
                                <div className="text-sm">
                                    <div className="flex justify-between">
                                        <span>                                            {info?.title || 'N/A'}
                                        </span>
                                        <span>
                                            {info?.amount}
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 text-gray-400">
                                        {info?.date
                                            ? format(new Date(info?.date), 'dd MMM yyyy')
                                            : 'N/A'}{' '}
                                        • {info?.time || 'N/A'}  • {info?.duration || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <button className='mt-4 w-full text-sm bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors'>
                                Pay Now
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}