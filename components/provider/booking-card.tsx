"use client";
import React, { useState, useEffect } from 'react'
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import { Calendar, Check, Clock3, FileText, Pen, X, Trash, AlertCircle } from 'lucide-react';

export const BookingCard = ({ user, info }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(info?.time || '');
    const [duration, setDuration] = useState(info?.duration || 60);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState('');
    const [availability, setAvailability] = useState(null);
    const token = sessionStorage.getItem('token');


    let statusClass = 'gray-500'; // default
    let mainstatusClass = 'bg-gray-600'; // default

    if (info.status === 'approved') {
        statusClass = 'green-400';
        mainstatusClass = 'bg-green-500';
    } else if (info.status === 'pending') {
        statusClass = 'amber-400';
        mainstatusClass = 'bg-amber-400';
    } else if (info.status === 'cancelled') {
        statusClass = 'red-500';
        mainstatusClass = 'bg-red-500';
    }else if (info.status === 'finished') {
        statusClass = 'blue-500';
        mainstatusClass = 'bg-blue-500';
    } else if (info.status === 'declined') {
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

    const cancelAppointment = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${info.id}/provider-cancel`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*'
            }
        });
        const data = await res.json();
        if (res.ok) {
            setShowPopup(false);
            alert('Appointment cancelled successfully');
            window.location.reload();
        } else {
            console.error('Error cancelling appointment:', data);
        }
    }

    // Accept appointment
    const acceptAppointment = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${info.id}/approve`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*'
            }
        });
        const data = await res.json();
        if (res.ok) {
            setShowPopup(false);
            alert('Appointment approved successfully');
            window.location.reload();
        } else {
            console.error('Error approving appointment:', data);
        }
    }

    // Decline appointment
    const declineAppointment = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${info.id}/decline`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'Access-Control-Allow-Origin': '*'
            },
           
        });
        const data = await res.json();
        if (res.ok) {
            setShowPopup(false);
            alert('Appointment declined successfully');
            window.location.reload();
        } else {
            console.error('Error declining appointment:', data);
        }
    }


    // Modify appointment popup state
    const [showModifyPopup, setShowModifyPopup] = useState(false);

    const modifyAppointment = () => {
        setShowModifyPopup(true);
        // Initialize with current booking date and time
        const initialDate = info?.date ? new Date(info.date) : new Date();
        setSelectedDate(initialDate);
        setSelectedTime(info?.time || '');
        setDuration(info?.duration || 60);
        
        // Immediately check availability for the initial date
        console.log('Modify popup opened, checking availability for:', initialDate);
        checkAvailability(initialDate);
    }

    const closeModifyPopup = () => {
        setShowModifyPopup(false);
        setAvailableSlots([]);
        setNote('');
        setAvailability(null);
    }

    // Check availability for selected date
    const checkAvailability = async (date) => {
        console.log('=== checkAvailability called ===');
        console.log('Date parameter:', date);
        console.log('Info object:', info);
        console.log('User object:', user);
        
        if (!date) {
            console.log('❌ Date missing, exiting');
            return;
        }
        
        // Get the numeric provider ID
        let providerId = user?.provider_id || info?.provider_id || info?.providerId;
        
        if (!providerId || typeof providerId !== 'number') {
            console.log('Need to fetch numeric provider ID from API');
            try {
                const providerIdRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/providers/me/id`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'Access-Control-Allow-Origin': '*'
                        }
                    }
                );
                const providerIdData = await providerIdRes.json();
                console.log('Provider ID API response:', providerIdData);
                
                if (providerIdRes.ok && providerIdData.provider_id) {
                    providerId = providerIdData.provider_id;
                } else {
                    console.log('❌ Failed to get provider ID');
                    return;
                }
            } catch (error) {
                console.error('Error fetching provider ID:', error);
                return;
            }
        }
        
        console.log('Final provider ID (numeric):', providerId);
        
        if (!providerId) {
            console.log('❌ No valid provider ID found');
            return;
        }
        
        setLoading(true);
        try {
            const formattedDate = typeof date === 'string' ? date : date.toISOString().split('T')[0];
            console.log('Formatted date for API:', formattedDate);
            console.log('Provider ID:', providerId);
            console.log('Token available:', !!token);
            
            const searchUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/availability/search?provider_id=${providerId}&date=${formattedDate}`;
            console.log('Making API call to:', searchUrl);
            
            // First try the search endpoint for date-specific availability with existing bookings
            const searchRes = await fetch(searchUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Access-Control-Allow-Origin': '*'
                }
            });
            
            const searchData = await searchRes.json();
            console.log('Availability Search Response:', searchData);
            
            if (searchRes.ok && searchData) {
                setAvailability(searchData);
                generateTimeSlotsFromSearchData(searchData);
                return;
            }
            
            // Fallback to provider schedule endpoint
            const providerRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/availability/provider/${providerId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Access-Control-Allow-Origin': '*'
                    }
                }
            );
            
            const providerData = await providerRes.json();
            console.log('Provider Availability Fallback Response:', providerData);
            
            if (providerRes.ok) {
                setAvailability(providerData);
                generateTimeSlotsFromSchedule(providerData, date);
            } else {
                console.error('Error fetching provider availability:', providerData);
                setAvailableSlots([]);
            }
        } catch (error) {
            console.error('Error checking availability:', error);
            setAvailableSlots([]);
        } finally {
            setLoading(false);
        }
    };

    // Generate time slots based on provider's weekly schedule
    const generateTimeSlotsFromSchedule = (scheduleData, selectedDate) => {
        console.log('generateTimeSlotsFromSchedule called with:', scheduleData, selectedDate);
        if (!scheduleData || !selectedDate) return;
        
        const slots = [];
        const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        console.log('Selected day:', dayOfWeek);
        
        // Find availability for the selected day
        const dayAvailability = scheduleData.find(entry => 
            entry.day_of_week === dayOfWeek && entry.active
        );
        
        console.log('Day availability:', dayAvailability);
        
        if (dayAvailability) {
            if (dayAvailability.mode === 'business_hours' && dayAvailability.start && dayAvailability.end) {
                // Generate time slots for business hours
                const startTime = new Date(`2000-01-01T${dayAvailability.start}`);
                const endTime = new Date(`2000-01-01T${dayAvailability.end}`);
                
                // Generate 30-minute slots
                for (let time = new Date(startTime); time < endTime; time.setMinutes(time.getMinutes() + 30)) {
                    const timeString = time.toTimeString().slice(0, 5);
                    
                    // Check if time conflicts with breaks
                    const isInBreak = dayAvailability.breaks?.some(breakSlot => 
                        timeString >= breakSlot.break_start && timeString < breakSlot.break_end
                    );
                    
                    if (!isInBreak) {
                        slots.push(timeString);
                    }
                }
            } else if (dayAvailability.mode === 'day_parts' && dayAvailability.day_parts) {
                // Generate time slots for day parts
                dayAvailability.day_parts.forEach(part => {
                    let startHour, endHour;
                    switch (part.toLowerCase()) {
                        case 'morning':
                            startHour = 6; endHour = 12;
                            break;
                        case 'afternoon':
                            startHour = 12; endHour = 17;
                            break;
                        case 'evening':
                            startHour = 17; endHour = 21;
                            break;
                        case 'night':
                            startHour = 21; endHour = 24;
                            break;
                        default:
                            return;
                    }
                    
                    for (let hour = startHour; hour < endHour; hour++) {
                        for (let minute = 0; minute < 60; minute += 30) {
                            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                            slots.push(timeString);
                        }
                    }
                });
            }
        }
        
        console.log('Generated slots:', slots);
        setAvailableSlots(slots.sort());
    };

    // Generate time slots from search endpoint data (includes existing bookings)
    const generateTimeSlotsFromSearchData = (searchData) => {
        console.log('generateTimeSlotsFromSearchData called with:', searchData);
        if (!searchData) return;
        
        const slots = [];
        
        // Try different possible response structures based on the API
        const availabilities = searchData.availability_entries || searchData.availabilities || [];
        const existingBookings = searchData.approved_bookings || searchData.bookings || [];
        
        console.log('Search availabilities:', availabilities);
        console.log('Search existing bookings:', existingBookings);
        
        availabilities?.forEach(entry => {
            if (!entry.active || !entry.start || !entry.end) return;
            
            const startTime = new Date(`2000-01-01T${entry.start}`);
            const endTime = new Date(`2000-01-01T${entry.end}`);
            
            // Generate 30-minute slots
            for (let time = new Date(startTime); time < endTime; time.setMinutes(time.getMinutes() + 30)) {
                const timeString = time.toTimeString().slice(0, 5);
                
                // Check if time conflicts with breaks
                const isInBreak = entry.breaks?.some(breakSlot => 
                    timeString >= breakSlot.break_start && timeString < breakSlot.break_end
                );
                
                // Check if slot conflicts with existing approved bookings (excluding current booking)
                const hasConflict = existingBookings?.some(booking => 
                    booking.id !== info.id && // Exclude current booking
                    booking.start_time <= timeString && 
                    booking.end_time > timeString
                );
                
                if (!isInBreak && !hasConflict) {
                    slots.push(timeString);
                }
            }
        });
        
        console.log('Generated slots from search:', slots);
        setAvailableSlots(slots.sort());
    };

    // Handle date change - immediately check availability for new date
    const handleDateChange = (date) => {
        console.log('=== handleDateChange called ===');
        console.log('New date selected:', date);
        
        setSelectedDate(date);
        setSelectedTime(''); // Clear selected time when date changes
        setAvailableSlots([]); // Clear previous slots
        
        if (date) {
            console.log('✅ Date is valid, calling checkAvailability');
            checkAvailability(date); // Call API immediately when date changes
        } else {
            console.log('❌ Date is null/undefined, not calling API');
        }
    };

    // Submit modification request
    const submitModification = async () => {
        console.log('=== submitModification called ===');
        console.log('Selected date:', selectedDate);
        console.log('Selected time:', selectedTime);
        console.log('Available slots:', availableSlots);
        console.log('Duration:', duration);
        
        if (!selectedDate || !selectedTime) {
            alert('Please select both date and time');
            return;
        }

        // Validate that selected time is available
        if (!availableSlots.includes(selectedTime)) {
            console.log('❌ Selected time not in available slots');
            alert('Selected time slot is not available');
            return;
        }
        
        console.log('✅ Selected time is in available slots, proceeding...');

        setLoading(true);
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const endTime = new Date(`2000-01-01T${selectedTime}`);
            endTime.setMinutes(endTime.getMinutes() + duration);
            const endTimeString = endTime.toTimeString().slice(0, 5);

            const requestBody = {
                date: formattedDate,
                start_time: selectedTime,
                end_time: endTimeString,
                notes: note,
                title: info?.title
            };
            
            console.log('Booking modification request body:', requestBody);
            console.log('Original booking info:', {
                id: info.id,
                date: info.date,
                time: info.time,
                status: info.status
            });

            // For approved bookings, use regular PATCH to modify (will move to pending)
            // For pending bookings, direct modification is allowed
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${info.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(requestBody)
                }
            );

            const data = await res.json();
            if (res.ok) {
                const statusMessage = info.status === 'approved' 
                    ? 'Booking modified successfully. Changes will require client approval.'
                    : 'Booking modified successfully.';
                alert(statusMessage);
                closeModifyPopup();
                window.location.reload(); // Refresh to show updated booking
            } else {
                alert('Error modifying booking: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error modifying booking:', error);
            alert('Error modifying booking');
        } finally {
            setLoading(false);
        }
    };


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

            {showPopup && (
                <div className='fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] z-50'>
                    <div className='relative bg-[#16171A] w-[450px] rounded-lg  p-6 flex flex-col gap-3 my-4 border border-[#2E2F31] transform transition-all duration-300 scale-95 animate-fadeIn'>

                        <button
                            onClick={closePopup}
                            className='absolute right-4 top-4 rounded-full  p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer'
                        >
                            <X size={18} color='white' />
                        </button>


                        <h2 className='text-lg font-bold mb-0 text-white'>
                            <div className={`w-[8px] h-[8px] rounded-full ${mainstatusClass} inline-block`}></div>&nbsp;&nbsp;&nbsp; {info?.title} </h2>
                        <p className='text-sm  block font-light pt-2 text-white-200'>with {info?.with}</p>

                        <div className='flex flex-col py-1.5'>
                            <p className='text-sm text-white-200 flex items-center gap-2 mb-2'>
                                <Calendar size={17} />
                                {info?.date}
                            </p>
                            <p className='text-sm text-white-200 flex items-center gap-2'>
                                <Clock3 size={17} />
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

                                    <button className='bg-transparent border border-[#2E2F31]  text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-600 cursor-pointer' onClick={modifyAppointment}>
                                        <Pen size={16} />
                                        Modify Appointment
                                    </button>
                                    <button className='bg-red-500 text-white px-4 py-2 mt-3 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-red-600 cursor-pointer' onClick={cancelAppointment}>
                                        <Trash size={17} />
                                        Cancel Appointment
                                    </button>

                                </div>
                            ) : info?.status === 'pending' ? (
                                <div>
                                    <button className='bg-blue-600 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-700 cursor-pointer' onClick={acceptAppointment}>
                                        <Check size={17} />
                                        Accept Appointment
                                    </button>

                                    <button className='bg-transparent border border-[#2E2F31] mt-2 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-400 cursor-pointer' onClick={modifyAppointment}>
                                        <Pen size={16} />
                                        Edit Appointment
                                    </button>

                                    <button className='bg-red-500 border border-[#2E2F31] mt-2 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-red-600 cursor-pointer' onClick={declineAppointment}>
                                        <X size={17} />
                                        Decline Appointment
                                    </button>

                                </div>
                            ) : null}
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
                            <X size={20} color='white' />
                        </button>

                        <h2 className='text-lg font-bold mb-0 text-white'>Modify Appointment</h2>
                        <p className='text-sm text-white-200'>
                            Appointment with {info?.with} <br />
                            {info.status === 'approved' 
                                ? 'Changes to approved bookings will require client approval'
                                : 'Changes will be applied immediately'
                            }
                        </p>

                        <p className='text-white text-m mt-2'>Select Date</p>

                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateChange}
                            defaultMonth={selectedDate}
                            disabled={{ before: new Date() }} // Disable past dates
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
                                <p className='text-white text-sm pb-1'>Available Time Slots</p>
                                {loading ? (
                                    <div className='text-center py-4'>
                                        <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                                        <p className='text-sm text-white-200 mt-2'>Checking availability for selected date...</p>
                                    </div>
                                ) : availableSlots.length > 0 ? (
                                    <div className='grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-[#2E2F31] rounded-lg p-2'>
                                        {availableSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedTime(slot)}
                                                className={`px-3 py-2 rounded text-sm transition-colors ${
                                                    selectedTime === slot
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-[#2E2F31] text-white-200 hover:bg-[#3E3F41]'
                                                }`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : selectedDate ? (
                                    <div className='text-center py-4 border border-[#2E2F31] rounded-lg'>
                                        <AlertCircle className='mx-auto mb-2 text-yellow-500' size={24} />
                                        <p className='text-sm text-white-200'>No available slots for this date</p>
                                    </div>
                                ) : (
                                    <div className='text-center py-4 border border-[#2E2F31] rounded-lg'>
                                        <p className='text-sm text-white-200'>Please select a date first</p>
                                    </div>
                                )}
                            </div>
                            <div className='mt-3'>
                                <p className='text-white text-sm pb-1'>Duration</p>
                                <select 
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className='bg-[#1C1E22] text-white-200 rounded-lg px-4 py-2 w-full border border-[#2E2F31]'
                                >
                                    <option value="15">15 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="45">45 minutes</option>
                                    <option value="60">60 minutes</option>
                                    <option value="90">90 minutes</option>
                                    <option value="120">120 minutes</option>
                                </select>
                            </div>
                        </div>

                        <p className='text-white text-sm mt-2'>Note to Client (Optional)</p>
                        <textarea
                            className='bg-[#1C1E22] text-white-200 rounded-lg px-4 py-2 w-full h-24 border border-[#2E2F31]'
                            placeholder='Explain why you need to modify this appointment...'
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />

                        <div className='grid grid-cols-2 gap-4 mt-1'>
                            <button
                                className='bg-transparent border border-[#2E2F31] text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-500 cursor-pointer'
                                onClick={closeModifyPopup}
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                className='bg-blue-600 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
                                onClick={submitModification}
                                disabled={loading || !selectedTime || !selectedDate}
                            >
                                {loading ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                ) : (
                                    <Check size={18} />
                                )}
                                {loading ? 'Submitting...' : 'Submit Changes'}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </>
    )
}