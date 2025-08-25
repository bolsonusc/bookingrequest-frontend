'use client';

import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import profileImage from '../../public/images/alex.png';
import groupLogo from '../../public/images/johnGropLogo.png';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/hooks/useAuth';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';

const getNext7Days = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

const DayPart = ({ part }) => {
  return (
    <button className='gap-2 align-items-center justify-center my-2 border-1  border-gray rounded bg-black-950 block p-2 px-6 text-sm flex gap-2'>
      <Clock size={20}/>
      {part}
    </button>
  )
}

export const getId = async()=>{
  const token = sessionStorage.getItem('token');
  try {
    // Get user id
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/providers/me/id`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      }
    });
    const data = await res.json();
    if(data?.error){
      throw data?.error;
    }
    return data[`provider_id`];
  } catch (error) {
    console.error(error);
  }
}

const Profile = () => {

  let dates: Date[] = getNext7Days();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [availability, setAvalibility] = useState(null);
  const router = useRouter();
  const { loading, user } = useAuth();

  const getDetails = async () => {
    const token = sessionStorage.getItem('token');
    const id = await getId();
    try {
      // Get provider details by id
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/providers/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*'
        }
      });
      const data = await res?.json();
      if (data?.error) {
        throw data?.error;
      }
      setUserDetails(data);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }

  const getAvailabilityByDate = async (date: Date, providerId: Number) => {
    const token = sessionStorage.getItem('token');
    const formatedDate = date?.toISOString().split('T')[0];
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability/search?provider_id=${providerId}&date=${formatedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*'
        }
      });
      const data = await res.json();
      if (data?.error) {
        throw data?.error;
      }
      data?.availabilities?.length ? setAvalibility(data?.availabilities[0]) : setAvalibility(null);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }

  const isSameDate = (date1: Date, date2: Date) => {
    const d1 = new Date(date1)?.toISOString().split('T')[0];
    const d2 = new Date(date2)?.toISOString().split('T')[0];
    return d1 === d2;
  };

  const selectDate = async (date: string | Date) => {
    setSelectedDate(new Date(date));
    const id = await getId();
    await getAvailabilityByDate(new Date(date), id);
  }

  useEffect(() => {
    getDetails();
  }, [user, loading]);

  return (
    <div className='bg-[#0B0C0E] text-white flex flex-col items-center'>
      <Head>
        <title>Profile</title>
        <meta name="description" content="User Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ===== HEADER BAR ===== */}
      <header className="h-[65px] text-center sticky top-0 backdrop-blur-xs bg-[#0B0C0ECC] border-b-1 border-gray flex flex-row items-center justify-center w-full">
        <button className='basis-2/100 w-8 cursor-pointer' onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <p className='font-normal text-lg leading-7 text-white-950 basis-90/100'>Public Profile Preview</p>
      </header>

      {/* ===== MAIN CARD ===== */}
      { loading ? 
        <div className="min-h-screen min-w-screen bg-black flex items-center justify-center text-white">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div> :
        <div className='flex flex-col items-center justify-center'>
          <div className='md:w-[720px] w-[90vw] bg-[#17191C] border-1 border-gray rounded-xl my-8 mx-6'>
            <div className='flex flex-wrap'>
              <Image className='profile-image' width={94} height={94} alt={userDetails?.user?.display_name || 'Profile Image'} src={userDetails?.user?.avatar || profileImage} />
              <div className='flex flex-col gap-2 text-sm px-3'>
                <h2 className='pt-6 font-bold text-2xl text-center text-white-950'>{userDetails?.user?.display_name || `${userDetails?.user?.firstName || ''} ${userDetails?.user?.lastName || ''}`}</h2>
                <p className='text-white-250'>@{userDetails?.user?.username || 'NA'}</p>
                <p className='flex items-center gap-1 text-white-250'>
                  <MapPin size={15} />
                  <span>{userDetails?.user?.city}, {userDetails?.user?.state}, {userDetails?.user?.country}</span>
                </p>
                <p className='text-center text-white-950'>{userDetails?.description || 'NA'}</p>
              </div>
            </div>
            <div className='border-t-1 border-gray flex flex-wrap py-5'>
              <Image className='w-12 h-12 ml-7 rounded-[10px]' alt='Group Logo' width={48} height={48} src={userDetails?.business_logo || groupLogo} />
              <div className='ml-4'>
                <h2 className='font-bold text-xl text-white-950'>{userDetails?.business_name || 'NA'}</h2>
                <Link className='text-xs text-blue-400 my-1' target='_blank' href={'https://johnsonconsulting.com'}>{userDetails?.business_url || `NA`}</Link>
              </div>
            </div>
            <div className='border-t-1 border-gray py-4 text-white-950 text-center'>
              <h3 className='text-center'>Services Offered</h3>
              <div className='flex flex-wrap gap-4 ml-6 mt-3'>
                {
                  userDetails?.services?.map(service => {
                    return <span className='bg-gray-950 text-[11px] rounded-full py-2 px-4' key={service.id}>{service?.name}</span>
                  })
                }
              </div>
            </div>
            <div className="border-t-1 border-gray text-center px-6 py-3">
              <h3 className='my-4'>Check Availability</h3>
              <h4 className='my-2 text-sm'>Select a Date</h4>
              <div className='flex flex-wrap justify-center gap-3 sm:mx-6 mx-1 my-3'>
                {dates.map((date) => {
                  return (
                    <button className={`w-14 h-14 border-1 rounded-xl border-gray ${isSameDate(date, selectedDate) && 'selected-date'}`} key={date.toISOString()} onClick={() => selectDate(date)}>
                      <span className={`text-[11px] ${!isSameDate(date, selectedDate) && 'text-white-250'}`}>{date?.toLocaleDateString("en-US", { weekday: "short" })}</span>
                      <div className={`font-bold text-lg ${!isSameDate(date, selectedDate) && 'text-white-950'}`}>{date.getDate()}</div>
                    </button>
                  );
                })}
              </div>
              <label htmlFor="manualDate" className='text-xs text-white-250'>Or enter date manually (MM/DD/YYYY)</label>
              <input type='date' className='my-2 h-[40px] w-full border-1 border-gray rounded bg-black-950 block p-[13px] text-sm placeholder:text-white-200' min={Date.now()} placeholder='MM/DD/YYYY' onChange={(e) => selectDate(e.target.value)} disabled/>
              {!selectedDate && <p className='text-sm text-white-250 mt-5 mb-3'>Please select a date to see available time slots</p>}

              {availability ?
                <div>
                  <h4 className='my-2 text-sm mt-6'>Available Times</h4>
                  <div className='flex justify-center items-center gap-3 mb-3'>
                    {availability?.day_parts ? availability?.day_parts?.map((day: string) => {
                      return <DayPart part={day} key={day} />
                    }) :
                      <>
                        {(Number(availability?.start?.split(':')[0]) < 5 && Number(availability?.end?.split(':')[0]) >= 12) && <DayPart part='Morning' key={1} />}
                        {(Number(availability?.start?.split(':')[0]) < 12 && Number(availability?.end?.split(':')[0]) >= 17) && <DayPart part='Afternoon' key={2} />}
                        {(Number(availability?.start?.split(':')[0]) < 17 && Number(availability?.end?.split(':')[0]) >= 21) && <DayPart part='Evening' key={3} />}
                        {(Number(availability?.start?.split(':')[0]) < 21 && Number(availability?.end?.split(':')[0]) <= 5) && <DayPart part='Night' key={4} />}
                      </>
                    }
                  </div>
                  <p className='text-xs text-white-250 mb-6'>Morning: 5am-12pm • Afternoon: 12pm-5pm • Evening: 5pm-9pm • Night: 9pm-5am</p>
                </div>
                : <p className='text-sm text-white-250 mb-6'>No timeslot available</p>
              }

              <label htmlFor="note" className='text-sm'>Add a note (optional)</label>
              <textarea rows={3} className='overflow-auto relative w-full border-1  border-gray rounded bg-black-950 block p-[13px] my-3 text-sm' placeholder='Add any specific requests or questions...' onChange={(e) => setNote(e.target.value)} />
              <button className='btn-blue w-full my-4 flex gap-2'>
                <Calendar size={20}/>
                <span>Request Booking</span>
              </button>
            </div>
          </div>
          <div className='md:w-[720px] bg-[#17191C] border-1 border-gray rounded-xl my-8 mx-6 px-6 py-4 text-center'>
            <p className="text-white-250 text-[13px]">This is a preview of how clients see your public profile. To edit this information, go to your profile settings.</p>
            <button className='w-full border-1 border-gray bg-black-950 mt-4 p-3 rounded-xl text-sm cursor-pointer hover:bg-black active:bg-gray-900' onClick={() => { router.push('profile/edit') }}>Edit Profile</button>
          </div>
        </div>
      }
    </div>
  )
}

export default Profile