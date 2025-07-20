"use client";
import React, { useState } from 'react'
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import { Calendar, Check, Clock3,  X, CalendarX  } from 'lucide-react';

export const BookingCard = ({ user, info }) => {

    const [selectedDate, setSelectedDate] = useState(new Date(2023, 9, 1)); // Oct 1, 2023

    let statusClass = 'text-gray-500'; // default

    if (info.status === 'approved') {
        statusClass = 'text-green-400';
    } else if (info.status === 'pending') {
        statusClass = 'text-amber-400';
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
                className='bg-[#16171A] rounded-lg p-6 flex flex-col gap-4 my-4 border border-[#2E2F31] relative cursor-pointer'
                onClick={modifyAppointment}
            >
                <div className='flex items-center justify-between'>
                    <h4 className='text-white text-m font-medium'>
                        {info?.title}
                        <span className='text-sm pl-10 pt-1 block font-normal text-white-200 '>
                            with {info?.with}
                        </span>
                    </h4>
                    <p className={`text-sm ${statusClass} capitalize`}>
                        <span
                            className='text-l inline-block mr-1'
                        >&#9679; </span>
                        {info?.status}</p>
                </div>
                <div className='flex flex-col '>
                    <p className='text-sm text-white-200 flex items-center gap-2 mb-3'>
                        <Calendar size={17} />
                        {info?.date}
                    </p>
                    <p className='text-sm text-white-200 flex items-center gap-2'>
                        <Clock3 size={17} />
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




            {showModifyPopup && (
                <div className='fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] z-50'>
                    <div className='relative bg-[#16171A] w-[450px] rounded-lg  p-6 flex flex-col gap-2 my-4 border border-[#2E2F31] transform transition-all duration-300 scale-95 animate-fadeIn '>

                        <button
                            onClick={closeModifyPopup}
                            className='absolute right-4 top-4 rounded-full  p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer'
                        >
                            <X size={20} color='white' />
                        </button>

                        <h2 className='text-lg font-bold mb-0 text-white'>Modify Appointment</h2>
                        <p className='text-sm text-white-200'>
                            Request changes to your appointment: <br /><b className='text-white font-medium'>{info?.title}</b>.</p>
                        <p className='text-sm text-white-200'>
                            Change requests will be sent to the provider for approval
                        </p>

                        <p className='text-white text-sm mt-2'>Select New Date</p>

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

                        <div className='mt-1'>
                            <div>
                                <p className='text-white text-sm pb-1'>Select Time</p>
                                <input
                                    type="time"
                                    className='text-white-200 rounded-lg px-4 py-2 w-full border border-[#2E2F31] '
                                    defaultValue={info?.time}
                                />
                            </div>

                        </div>

                        <p className='text-white text-sm mt-2'>Note to Client (Optional)</p>
                        <textarea
                            className='text-white-200 rounded-lg px-4 py-2 w-full   border border-[#2E2F31] overflow-y-hidden'
                            placeholder='Explain why you need to modify this appointment...'
                            name='note'
                            rows={4}
                            
                        >

                        </textarea>
                            <hr className='border-[#2E2F31] my-4' />
                        <button
                            className='bg-red-500 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-red-700 cursor-pointer'
                            onClick={closeModifyPopup}
                        >
                            <CalendarX />
                            Request Cancellation
                        </button>
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
                                <Check size={18} />
                                Submit Changes
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </>
    )
}