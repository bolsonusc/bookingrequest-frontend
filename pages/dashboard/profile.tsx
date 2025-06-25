'use client';

import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import profileImage from '../../public/images/alex.png';
import groupLogo from '../../public/images/johnGropLogo.png';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../src/hooks/useAuth';

const getNext7Days = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

const DayPart = ({part}) => {
  return (
    <button className='flex gap-2 align-items-center justify-center my-2 border-1 rounded-[10px] border-gray rounded bg-black-950 block p-2 px-6 text-sm'>
      <div className="text-white-250 w-5 h-5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 28 28" stroke="currentColor" strokeWidth="2" className="w-full h-full">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      {part}
    </button>
  )
}

const Profile = () => {

  let dates: Date[] = getNext7Days();
  const [selectedDate, setSelectedDate] = useState(null);
  const [note, setNote] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [availability, setAvalibility] = useState(null);
  const router = useRouter();
  const { loading, user } = useAuth();
  const id = 23;

  const getDetails = async(id:Number|String)=>{
    const token = localStorage.getItem('token');
    try {
      // Get provider details by id
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/providers/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
        }
      });
      const data = await res?.json();
      console.log(data);
      if(data?.error){
        throw data?.error;
      }
      setUserDetails(data);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }

  // const getId = async()=>{
  //   const token = localStorage.getItem('token');
  //   try {
  //     // Get user id
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${user?.role}s/me/id`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization' : `Bearer ${token}`
  //       }
  //     });
  //     const data = await res.json();
  //     if(data?.error){
  //       throw data?.error;
  //     }
  //     return data[`${user?.role}_id`];
  //   } catch (error) {
  //     console.error(error);
  //     setError(error);
  //   }
  // }

  const getAvailabilityByDate = async(date: Date, providerId: Number)=>{
    const token = localStorage.getItem('token');
    const formatedDate = date?.toISOString().split('T')[0];
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability/search?provider_id=${providerId}&date=${formatedDate}`, {
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      });
      const data = await res.json();
      if(data?.error){
        throw data?.error;
      }
      data?.availabilities?.length && setAvalibility(data?.availabilities[0]);
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

  const selectDate = async(date: string | Date)=>{
    setSelectedDate(new Date(date));
    await getAvailabilityByDate(new Date(date), id);
  }

  useEffect(()=>{
    getDetails(id);
  },[user, loading]);


  if (loading) {
    return (
      <div className="min-h-screen flex flex-wrap items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }


  return (
    <div className='bg-[#0B0C0E] text-white flex flex-col items-center min-w-screen'>
      <Head>
        <title>Profile</title>
        <meta name="description" content="User Profile" />
        <link rel="icon" href="/favicon.ico" />
        <style>
          {`
            .PhoneInputCountrySelect option  {
              color: #1E1E1E;
            }
            .PhoneInputInput:focus {
              outline: none;
            }
            .PhoneInputInput{
              padding-left: 10px;
            }
          `}
        </style>
      </Head>

      {/* ===== HEADER BAR ===== */}
      <header className="h-[65px] w-screen sticky top-0 backdrop-blur-xs bg-[#0B0C0ECC] border-b-1 border-gray flex flex-row items-center justify-center text-center">
        <button className='basis-2/100 w-8 cursor-pointer' onClick={()=>router.back()}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7-7m-7 7l7 7" />
          </svg>
        </button>
        <p className='font-normal text-lg leading-7 text-white-950 basis-90/100'>Public Profile Preview</p>
      </header>

      {/* ===== MAIN CARD ===== */}
      <div>
        <div className='max-w-[720px] bg-[#17191C] border-1 border-gray rounded-xl my-8 mx-6'>
          <div className='flex flex-row'>
            <Image className='profile-image' width={94} height={94} alt={userDetails?.user?.display_name || 'Profile Image'} src={userDetails?.user?.avatar || profileImage}/>
            <div className=' flex flex-col gap-2 text-sm px-3'>
              <h2 className='pt-6 font-bold text-2xl text-center text-white-950'>{userDetails?.user?.display_name || `${userDetails?.user?.firstName || ''} ${userDetails?.user?.lastName || ''}`}</h2>
              <p className='text-white-250'>@{userDetails?.user?.username || 'NA'}</p>
              <p className='flex items-center gap-1 text-white-250'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4" >
                  <circle cx="12" cy="10.5" r="3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 5.25-7.5 10.5-7.5 10.5S4.5 15.75 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>{userDetails?.user?.city}, {userDetails?.user?.state  }, {userDetails?.user?.country}</span>
              </p>
              <p className='text-center text-white-950'>{userDetails?.description || 'NA'}</p>
            </div>
          </div>
          <div className='border-t-1 border-gray flex py-5'>
            <Image className='w-12 h-12 ml-7 rounded-[10px]' alt='Group Logo' width={48} height={48} src={userDetails?.business_logo || groupLogo}/>
            <div className='ml-4'>
              <h2 className='font-bold text-xl text-white-950'>{userDetails?.business_name || 'NA'}</h2>
              <Link className='text-xs text-blue-400 my-1' target='_blank' href={'https://johnsonconsulting.com'}>{userDetails?.business_url || `NA`}</Link>
            </div>
          </div>
          <div className='border-t-1 border-gray py-4 text-white-950 text-center'>
            <h3 className='text-center'>Services Offered</h3>
            <div className='flex gap-4 ml-6 mt-3'>
              {
                userDetails?.services?.map(service=>{
                  return <span className='bg-gray-950 text-[11px] rounded-full py-2 px-4' key={service.id}>{service?.name}</span>
                })
              }
            </div>
          </div>
          <div className="border-t-1 border-gray text-center px-6 py-3">
            <h3 className='my-4'>Check Availability</h3>
            <h4 className='my-2 text-sm'>Select a Date</h4>
            <div className='flex flex-row gap-3 sm:mx-6 mx-1 my-3'>
              { dates.map((date)=>{
                  return (
                    <button className={`w-14 h-14 border-1 rounded-xl border-gray ${isSameDate(date, selectedDate) && 'selected-date'}`} key={date.toISOString()} onClick={()=>selectDate(date)}>
                      <span className={`text-[11px] ${!isSameDate(date, selectedDate) && 'text-white-250'}`}>{date?.toLocaleDateString("en-US", { weekday: "short" })}</span>
                      <div className={`font-bold text-lg ${!isSameDate(date, selectedDate) && 'text-white-950'}`}>{date.getDate()}</div>
                    </button>
                  );
              })}
            </div>
            <label htmlFor="manualDate" className='text-xs text-white-250'>Or enter date manually (MM/DD/YYYY)</label>
            <input type='date' className='my-2 h-[40px] w-full border-1 rounded-[10px] border-gray rounded bg-black-950 block p-[13px] text-sm' placeholder='MM/DD/YYYY' onChange={(e)=>selectDate(e.target.value)}/>
            { !availability && <p className='text-sm text-white-250 mt-5 mb-3'>Please select a date to see available time slots</p>}
            
            { availability && 
              <div>
                <h4 className='my-2 text-sm mt-6'>Available Times</h4>
                <div className='flex justify-center items-center gap-3 mb-3'>
                  { availability?.day_parts ? availability?.day_parts?.map((day:string)=>{
                      return <DayPart part={day}></DayPart>
                    }) : 
                    <>
                      { (Number(availability?.start?.split(':')[0]) < 5 && Number(availability?.end?.split(':')[0]) >= 12) && <DayPart part='Morning'></DayPart>}
                      { (Number(availability?.start?.split(':')[0]) < 12 && Number(availability?.end?.split(':')[0]) >= 17) && <DayPart part='Afternoon'></DayPart>}
                      { (Number(availability?.start?.split(':')[0]) < 17 && Number(availability?.end?.split(':')[0]) >= 21) && <DayPart part='Evening'></DayPart>}
                      { (Number(availability?.start?.split(':')[0]) < 21 && Number(availability?.end?.split(':')[0]) <= 5) && <DayPart part='Night'></DayPart>}
                    </>
                  }
                </div>
                <p className='text-xs text-white-250 mb-6'>Morning: 5am-12pm • Afternoon: 12pm-5pm • Evening: 5pm-9pm • Night: 9pm-5am</p>
              </div>
            }

            <label htmlFor="note" className='text-sm'>Add a note (optional)</label>
            <textarea rows={3} className='overflow-auto relative w-full border-1 rounded-[10px] border-gray rounded bg-black-950 block p-[13px] my-3 text-sm' placeholder='Add any specific requests or questions...' onChange={(e)=> setNote(e.target.value)}/>
            <button className='btn-blue w-full my-4'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-300 mx-3" >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Request Booking</span>
            </button>
          </div>
        </div>
        <div className='max-w-[720px] bg-[#17191C] border-1 border-gray rounded-xl my-8 mx-6 px-6 py-4 text-center'>
          <p className="text-white-250 text-[13px]">This is a preview of how clients see your public profile. To edit this information, go to your profile settings.</p>
          <button className='w-full border-1 border-gray bg-black-950 mt-4 p-3 rounded-xl text-sm' onClick={()=>{router.push('/settings')}}>Edit Profile</button>
        </div>
      </div>
    </div>
  )
}

export default Profile