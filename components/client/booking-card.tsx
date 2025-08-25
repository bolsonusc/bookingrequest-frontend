"use client";
import React, { useState, useEffect } from 'react'
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import { Calendar, Check, Clock3, X, CalendarX, AlertCircle } from 'lucide-react';

export const BookingCard = ({ user, info }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(info?.time || '');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState('');
    const [availability, setAvailability] = useState(null);
    const token = sessionStorage.getItem('token');

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
        // Initialize with current booking date and time
        const initialDate = info?.date ? new Date(info.date) : new Date();
        setSelectedDate(initialDate);
        setSelectedTime(info?.time || '');
        
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
        
        // For client component, we need the provider ID from the booking
        // The booking should contain provider information
        let providerId = info?.provider_id || info?.providerId;
        console.log('Provider ID from booking info:', providerId);
        console.log('Available info keys:', Object.keys(info || {}));
        
        if (!providerId) {
            console.log('❌ No provider ID in booking info');
            console.log('Full info object:', info);
            
            // If no provider ID in booking info, we need to fetch the full booking details
            // that should include provider information
            console.log('Attempting to fetch full booking details to get provider ID...');
            try {
                const bookingRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${info.id}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'Access-Control-Allow-Origin': '*'
                        }
                    }
                );
                const bookingData = await bookingRes.json();
                console.log('Full booking data:', bookingData);
                
                if (bookingRes.ok && bookingData) {
                    providerId = bookingData.provider_id || bookingData.providerId || bookingData.provider?.id;
                    console.log('Provider ID from full booking:', providerId);
                } else {
                    console.log('❌ Failed to fetch full booking details');
                    return;
                }
            } catch (error) {
                console.error('Error fetching booking details:', error);
                return;
            }
        }
        
        if (!providerId) {
            console.log('❌ Still no provider ID found after checking booking details');
            return;
        }
        
        // Ensure provider ID is numeric
        if (typeof providerId === 'string') {
            providerId = parseInt(providerId, 10);
        }
        
        console.log('Final provider ID (numeric):', providerId);
        
        if (!providerId || isNaN(providerId)) {
            console.log('❌ Invalid provider ID');
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
        if (!selectedDate || !selectedTime) {
            alert('Please select both date and time');
            return;
        }

        // Validate that selected time is available
        if (!availableSlots.includes(selectedTime)) {
            alert('Selected time slot is not available');
            return;
        }

        setLoading(true);
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const endTime = new Date(`2000-01-01T${selectedTime}`);
            endTime.setMinutes(endTime.getMinutes() + (info?.duration || 60));
            const endTimeString = endTime.toTimeString().slice(0, 5);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${info.id}/request-change`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        date: formattedDate,
                        start_time: selectedTime,
                        end_time: endTimeString,
                        notes: note,
                        title: info?.title
                    })
                }
            );

            const data = await res.json();
            if (res.ok) {
                alert('Change request submitted successfully');
                closeModifyPopup();
                window.location.reload(); // Refresh to show updated status
            } else {
                alert('Error submitting change request: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error submitting modification:', error);
            alert('Error submitting change request');
        } finally {
            setLoading(false);
        }
    };

    // Cancel booking
    const cancelBooking = async () => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;
        
        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${info.id}/client-cancel`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        notes: 'Cancelled by client'
                    })
                }
            );

            const data = await res.json();
            if (res.ok) {
                alert('Booking cancelled successfully');
                closeModifyPopup();
                window.location.reload();
            } else {
                alert('Error cancelling booking: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Error cancelling booking');
        } finally {
            setLoading(false);
        }
    };


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
                        </div>

                        <p className='text-white text-sm mt-2'>Note to Provider (Optional)</p>
                        <textarea
                            className='text-white-200 rounded-lg px-4 py-2 w-full border border-[#2E2F31] overflow-y-hidden'
                            placeholder='Explain why you need to modify this appointment...'
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={4}
                        />
                            <hr className='border-[#2E2F31] my-4' />
                        <button
                            className='bg-red-500 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 font-normal text-sm hover:bg-red-700 cursor-pointer'
                            onClick={cancelBooking}
                            disabled={loading}
                        >
                            <CalendarX />
                            Cancel Booking
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