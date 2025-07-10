"use client";
import React, { useState } from 'react'
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import { Calendar, Check, Clock3, Copy, Download, FileText, Link, Pen, RefreshCcw, SquarePen, X } from 'lucide-react';

export const BookingCard = ({ user, info }) => {

    const [selectedDate, setSelectedDate] = useState(new Date(2023, 9, 1)); // Oct 1, 2023

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


    // Modify appointment popup state
    const [showModifyPopup, setShowModifyPopup] = useState(false);

    const modifyAppointment = () => {
        setShowModifyPopup(true);
    }

    const closeModifyPopup = () => {
        setShowModifyPopup(false);
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
                        <Calendar size={17} />
                        {info?.date}
                    </p>
                    <p className='text-sm text-white-200 flex items-center gap-2'>
                        <Clock3 size={17}/>
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
                            <X size={18} color='white'/>
                        </button>


                        <h2 className='text-lg font-bold mb-0 text-white'>
                            <div className={`w-[8px] h-[8px] rounded-full ${statusClass} inline-block`}></div>&nbsp;&nbsp;&nbsp; {info?.title} </h2>
                        <p className='text-sm  block font-light pt-2 text-white-200'>with {info?.with}</p>

                        <div className='flex flex-col py-1.5'>
                            <p className='text-sm text-white-200 flex items-center gap-2 mb-2'>
                                <Calendar size={17}/>
                                {info?.date}
                            </p>
                            <p className='text-sm text-white-200 flex items-center gap-2'>
                                <Clock3 size={17}/>
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
                                        <FileText size={17} />
                                        View Invoice ({info?.invoice})
                                    </button>

                                    <button className='bg-transparent border border-[#2E2F31] mt-2 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-600 cursor-pointer' onClick={modifyAppointment}>
                                        <Pen size={16} />
                                        Modify Appointment
                                    </button>
                                </div>
                            ) : info?.status === 'pending' ? (
                                <div>
                                    <button className='bg-blue-600 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-700'>
                                        <Check size={17} />
                                        Accept Appointment
                                    </button>

                                    <button className='bg-transparent border border-[#2E2F31] mt-2 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-400 cursor-pointer' onClick={modifyAppointment}>
                                        <Pen size={16}/>
                                        Edit Appointment
                                    </button>

                                    <button className='bg-red-500 border border-[#2E2F31] mt-2 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-red-600'>
                                        <X size={17}/>
                                        Decline Appointment
                                    </button>

                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {showInvoicePopup && (
                <div className='fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] z-50'>
                    <div className='relative bg-[#16171A] w-[600px] rounded-lg  px-10 py-6 flex flex-col  my-4 border border-[#2E2F31] transform transition-all duration-300 scale-95 animate-fadeIn'>

                        <button
                            onClick={closeInvoicePopup}
                            className='absolute right-4 top-4 rounded-full  p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer'
                        >
                            <X size={17} color='white'/>
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
                                <Link size={16} />
                                Share URL
                            </button>

                            <button className='bg-red-500 border border-[#2E2F31] mt-2 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-red-600'>
                                <RefreshCcw size={16} />
                                Refund Invoice
                            </button>

                        </div>

                        <div className='mt-5'>
                            <ul className='text-white-200 text-sm flex  gap-3'>
                                <li className='w-full'>
                                    <a href="#" className='flex items-center gap-2 text-white border border-[#2E2F31] hover:bg-[#5275e0] px-4 py-2 rounded-lg  w-full justify-center'>
                                        <Download size={20} />
                                        Download
                                    </a>
                                </li>
                                <li className='w-full'>
                                    <a href="#" className='flex items-center gap-2 text-white border border-[#2E2F31] hover:bg-[#5275e0] px-4 py-2 rounded-lg  w-full justify-center'>
                                        <Copy size={16} />
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
                                        <X size={20} />
                                        Close
                                    </a>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {showModifyPopup && (
                <div className='fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] z-50'>
                    <div className='relative bg-[#16171A] w-[450px] rounded-lg  p-6 flex flex-col gap-2 my-4 border border-[#2E2F31] transform transition-all duration-300 scale-95 animate-fadeIn'>

                        <button
                            onClick={closeModifyPopup}
                            className='absolute right-4 top-4 rounded-full  p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer'
                        >
                            <X size={20} color='white'/>
                        </button>

                        <h2 className='text-lg font-bold mb-0 text-white'>Modify Appointment</h2>
                        <p className='text-sm text-white-200'>
                            Appointment with {info?.with} <br />
                            Changes will be sent to the client for approval
                        </p>

                        <p className='text-white text-m mt-2'>Select Date</p>

                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            defaultMonth={selectedDate}
                            className="rounded-lg px-3 text-white-200 w-full border border-[#2E2F31] "
                            styles={{
                                caption: { color: 'white' },
                                day: { color: 'white' },
                                selected: { backgroundColor: '#5275e0', color: 'white', textAlign: 'center' },
                                today: { color: '#5275e0' },
                            }}
                            modifiersClassNames={{
                                selected: 'bg-blue-600 text-white rounded-full',
                                today: 'text-blue-600',
                            }}
                        />

                        <div className='grid grid-cols-2 gap-4 mt-1'>
                            <div>
                                <p className='text-white text-m pb-1'>Select Time</p>
                                <input
                                    type="time"
                                    className='bg-[#1C1E22] text-white-200 rounded-lg px-4 py-2 w-full border border-[#2E2F31] '
                                    defaultValue={info?.time}
                                />
                            </div>
                            <div>
                                <p className='text-white text-m pb-1'>Duration</p>
                                <select className='bg-[#1C1E22] text-white-200 rounded-lg px-4 py-2 w-full border border-[#2E2F31] '>
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">60 minutes</option>
                                    <option value="90">90 minutes</option>
                                </select>
                            </div>
                        </div>

                        <p className='text-white text-m mt-2'>Note to Client (Optional)</p>
                        <textarea
                            className='bg-[#1C1E22] text-white-200 rounded-lg px-4 py-2 w-full h-24 border border-[#2E2F31] '
                            placeholder='Explain why you need to modify this appointment...'

                        >

                        </textarea>

                        <div className='grid grid-cols-2 gap-4 mt-1'>
                            <button
                                className='bg-transparent border border-[#2E2F31] text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-500 cursor-pointer'
                                onClick={closeModifyPopup}
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                className='bg-blue-600 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-700'
                                onClick={closeModifyPopup}
                            >
                                <Check size={18}/>
                                Submit Changes
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </>
    )
}