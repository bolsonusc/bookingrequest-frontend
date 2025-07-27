'use client';

import { ArrowLeft, ChevronDown, ChevronUp, Info } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import CustomRadio from '../../components/utils/CustomRadioButton';
import CustomSwitchButton from '../../components/utils/CustomSwitchButton';
import { DAYPARTS, WEEKDAYS } from '../../components/utils/constants';
import { getId } from '../dashboard/profile';

type BreakSlot = { break_start: string; break_end: string };

const Availability = () => {
  const router  = useRouter();
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('business_hours');
  const [activeDays, setActiveDays] = useState<string[]>(WEEKDAYS.slice(0,5));
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Record<
    string,
    {
      id ?: Number;
      start: string;
      end: string;
      breaks: BreakSlot[];
    }
  >>(
    activeDays?.reduce((acc, day) => {
      acc[day]= {
        start:"09:00",
        end: "17:00"
      }
      return acc;
    }, {})
  );
  const [activeDayparts, setActiveDayparts] = useState<Record<string, string[]>>(
    activeDays?.reduce((acc, day) => {
      acc[day] = DAYPARTS.slice(0, 2); // ['Morning', 'Afternoon']
      return acc;
    }, {})
  );

  const handleBreakChange = async(day: string, index : number, key: 'break_start' | 'break_end', value: string) => {
    const updated = [...(schedule[day]?.breaks || [])];
    updated[index][key] = value;
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        breaks: updated,
      },
    }));
  };

  const addBreak = async(day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        breaks: [...prev[day]?.breaks, { break_start: '12:00', break_end: '13:00' }],
      },
    }));
  };

  const removeBreak = (day: string, index: number) => {
    const updated = [...(schedule[day]?.breaks || [])];
    updated.splice(index, 1);
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        breaks: updated,
      },
    }));
  };

  const toggleExpandedDay = (val: string)=>{
    !expandedDays?.includes(val) ? setExpandedDays(prev=> [...prev, val]) : setExpandedDays(prev=> prev?.filter(day => day != val));
  }

  const toggleDay=(val:string)=>{
    if(!activeDays?.includes(val)){
      setActiveDays((prev)=>[...prev, val]);
      setSchedule((prev) => ({
        ...prev,
        [val]: {
          ...prev[val],
          start: '09:00',
          end: '17:00'
        }
      }));
    } else {
      setActiveDays(prev=> prev?.filter(day => day != val));
      delete schedule[val];
    }
  }

  const toggleDayPart=(e)=>{
    const day = e.target.name;
    const part = e.target.value;
    !activeDayparts[day]?.includes(part) ?
    setActiveDayparts((prev) => ({
      ...prev,
      [day]: [...prev[day], part]
    })) 
    : setActiveDayparts(prev=>({
      ...prev,
      [day]: prev[day]?.filter(p => p !== part)
    }));
  }

  const getAvailability = async()=>{
    const token = sessionStorage.getItem('token');
    const id = await getId();
    try {
      // Get provider details by id
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability/provider/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*'
        }
      });
      const data = await res?.json();
      console.log(data);
      if (data?.error) {
        throw data?.error;
      }

      if(data.length > 0){
        const availability = data.reduce((acc, item)=>{
          const {day_of_week, mode: dataMode, active, start, end, breaks, day_parts, id} = item;
          const day = day_of_week[0].toUpperCase()+day_of_week.substring(1);
          const dayParts = day_parts?.map(part => part[0]?.toUpperCase()+part.substring(1));
          dataMode === 'business_hours' ? 
            acc[day] = {
              id,
              start,
              end, 
              breaks
            } : 
            acc[day] = dayParts;
          return acc;
        }, {});
        console.log(availability);
        setMode(data[0]?.mode);
        data[0]?.mode === 'business_hours' ? setSchedule(availability) : setActiveDayparts(availability);
        setActiveDays(Object.keys(availability));
      }
    } catch (error) {
      console.error(error);
      // setError(error);
    } finally{
      setLoading(false);
    }
  }

  const setWeeklyAvailability = async()=>{
    const token = sessionStorage.getItem('token');
    const id = await getId();
    const week = mode==='business_hours' ? Object.keys(schedule).map((day) => {
      const dayData = schedule[day];
      return {
        day: day.toLowerCase(),
        active: true,
        mode,
        slots: [
          {
            start: dayData.start?.substring(0,5),
            end: dayData.end?.substring(0,5),
            breaks: dayData.breaks || []
          }
        ]
      };
    }) :
    activeDays?.map(day=>{
      return {
        day: day.toLowerCase(),
        active: true,
        mode,
        day_parts : activeDayparts[day]?.map(part=>part.toLowerCase())
      }
    });

    try {
      // Set weekly availability with "business_hours" mode
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          provider_id: id,
          week
        })
      });
      const data = await res?.json();
      if (data?.error) {
        throw data?.error;
      }
      alert(data?.message);
      router.push('/settings')
    } catch (error) {
      console.error(error);
    }
  }
  
  const updateBreak = async(day: string) => {
    const token = sessionStorage.getItem('token');
    const id = schedule?.[day]?.id;
    console.log(id, schedule?.[day]?.breaks);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability/${id}/break`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
          mode: 'business_hours',
          breaks: schedule?.[day]?.breaks
        })
      });
      const data = await res.json();
      console.log(data);
      if(data?.error){
        throw data?.error;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const updateTime = async(day: string) => {
    const token = sessionStorage.getItem('token');
    const id = schedule?.[day]?.id;
    console.log(id, schedule?.[day]);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability/${id}/time`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
          mode: 'business_hours',
          start: schedule?.[day]?.start,
          end: schedule?.[day]?.end
        })
      });
      const data = await res.json();
      console.log(data);
      if(data?.error){
        throw data?.error;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const updateDayParts = async(day: string, id: number) => {
    const token = sessionStorage.getItem('token');
    // const id = activeDayparts?.[day]?.id;
    console.log(id, schedule?.[day]?.breaks);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability/${id}/day-parts`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
          day_parts: activeDayparts[day]
        })
      });
      const data = await res.json();
      console.log(data);
      if(data?.error){
        throw data?.error;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const updateActiveStatus = async(day: string, id: string) => {
    const token = sessionStorage.getItem('token');
    // const id = '';
    console.log(id, schedule?.[day]?.breaks);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/availability/${id}/active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({
          active: true
        })
      });
      const data = await res.json();
      console.log(data);
      if(data?.error){
        throw data?.error;
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
    getAvailability();
  }, []);

  return (
    <div className='bg-[#0B0C0E] text-white-950 flex flex-col items-center'>
      <Head>
        <title>Availability</title>
        <meta name="description" content="Availability" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ===== HEADER BAR ===== */}
      <header className="w-[90vw] pb-5 pt-10 mx-auto border-b-1 border-gray flex flex-row items-center justify-center text-center">
        <button className='basis-2/100 w-8 cursor-pointer' onClick={()=>router.back()}>
          <ArrowLeft size={20} />
        </button>
        <p className='font-normal text-lg leading-7 basis-90/100'>Availability</p>
      </header>

      {/* ===== MAIN PAGE ===== */}
      { loading ?
        <div className="min-h-screen min-w-screen bg-black flex items-center justify-center text-white">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div> : 
        <>
          <div className='bg-black-950 my-4 mx-6 flex flex-col text-center w-[90vw]'>
            <div className='bg-[#22252A4D] text-[13px] text-white-250 p-4 rounded-xl flex gap-2 items-center mb-3'>
              <Info size={20} color='#1D4FD7'/>
              Set your availability to let clients know when they can book your services.
            </div>
            <h2 className='text-[15px] my-3'>Availability Mode</h2>

            <div className='flex gap-2 w-full'>
              <div className='basis-1/2 border-1 border-gray rounded-xl p-4 flex gap-4 items-start'>
                <CustomRadio name='mode' value='business_hours' checked={mode === 'business_hours'} onChange={(e)=> setMode(e.target.value)} id='business_hours'/>
                <div>
                  <label htmlFor="business_hours" className='cursor-pointer text-sm'>Business Hours</label>
                  <p className='text-xs/7 text-white-250'>Set specific start and end times for each day</p>
                </div>
              </div>
              <div className='basis-1/2 border-1 border-gray rounded-xl p-4 flex gap-4 items-start'>
                <CustomRadio name='mode' value='day_parts' checked={mode === 'day_parts'} onChange={(e)=>setMode(e.target.value)} id={'day_parts'}/>
                <div>
                  <label htmlFor="day_parts" className='cursor-pointer text-sm'>Day Parts</label>
                  <p className='text-xs/7 text-white-250'>Choose morning, afternoon, evening, or night availability</p>
                </div>
              </div>
            </div>

            <div className='my-4'>
              { WEEKDAYS.map(day=>{
                  const isExpanded = expandedDays?.includes(day);
                  const isActive = activeDays?.includes(day);
                  return(
                    mode === 'business_hours' ?
                    <div key={day} className='border-1 border-[#FFFFFF1A] bg-[#17191CE5] rounded-xl  shadow-lg backdrop-blur-md my-2'>
                      <div className='w-full flex gap-3 justify-between border-b-1 p-4 border-[#FFFFFF1A]' onClick={()=>toggleExpandedDay(day)}>
                        <div className='flex items-center gap-3'>
                          <CustomSwitchButton value={day} checked={activeDays?.includes(day)} onChange={(e)=> toggleDay(e.target.value)} id={day} />
                          <span className='text-[15px]'>{day}</span>
                        </div>
                        { activeDays?.includes(day) &&
                          <div className='flex items-center gap-3'>
                            <span className='text-white-250 text-[13px]'>{schedule[day]?.start?.substring(0,5)}  - {schedule[day]?.end?.substring(0, 5)} </span>
                            { isExpanded ? <ChevronUp size={16} className='mr-0 w-4'/> : <ChevronDown size={16} className='mr-0 w-4'/>}
                          </div>
                        }
                      </div>
                      { isActive && isExpanded && 
                        <div className="p-5">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block mb-1 text-[13px] text-white-250">Start Time</label>
                              <div className="relative">
                                <input type="time" value={schedule[day]?.start} 
                                  onChange={(e) =>
                                    setSchedule((prev) => ({
                                      ...prev,
                                      [day]: { ...prev[day], start: e.target.value },
                                    }))
                                  }
                                  className="w-full bg-[#22252a] text-sm text-white-950 px-4 py-2 rounded-xl"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block mb-1 text-[13px] text-white-250">End Time</label>
                              <div className="relative">
                                <input
                                  type="time"
                                  value={schedule[day]?.end}
                                  onChange={(e) =>
                                    setSchedule((prev) => ({
                                      ...prev,
                                      [day]: { ...prev[day], end: e.target.value },
                                    }))
                                  }
                                  className="w-full bg-[#22252a] text-sm px-4 py-2 rounded-xl"
                                />
                              </div>
                            </div>
                          </div>

                          {schedule[day]?.breaks && <label className="block text-xs text-white-250 mb-2">Breaks</label>}
                          {schedule[day]?.breaks?.map((b, i) => (
                            <div key={i} className="grid grid-cols-2 gap-4 mb-3">
                              <div className="relative">
                                <input
                                  type="time"
                                  value={b?.break_start}
                                  onChange={(e) => handleBreakChange(day, i, 'break_start', e.target.value)}
                                  className="w-full bg-[#22252a] px-4 py-2 text-xs rounded-xl"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="relative w-full">
                                  <input
                                    type="time"
                                    value={b?.break_end}
                                    onChange={(e) => handleBreakChange(day, i, 'break_end', e.target.value)}
                                    className="w-full bg-[#22252a] px-4 py-2 text-xs rounded-xl"
                                  />
                                </div>
                                <button
                                  onClick={() => removeBreak(day, i)}
                                  className="text-xs text-red-500/75 hover:text-red-500 active:text-red-600"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}

                          <button
                            onClick={() => addBreak(day)}
                            className="text-blue-600/75 text-sm rounded px-3 py-1 hover:text-blue-700 active:text-blue-800 transition"
                          >
                            + Add Break
                          </button>
                        </div>
                      }
                    </div>
                    : 
                    <div key={day} className='border-1 border-[#FFFFFF1A] bg-[#17191CE5] rounded-xl  shadow-lg backdrop-blur-md my-2'>
                      <div className='w-full flex flex-col gap-3 justify-between'>
                        <div className='flex items-center gap-3 text-sm border-b-1 p-4 border-[#FFFFFF1A]/50'>
                          <span className={`p-2 rounded-xl border-1 border-gray font-medium ${isActive ? 'text-blue-600 bg-[#1d4fd71a]' : 'bg-[#22252a80s]'} cursor-pointer hover:bg-blue-500/50 hover:text-white active:bg-blue-500/75`} onClick={()=> toggleDay(day)}>
                            {isActive ? 'Available' : 'Unavailable'}
                          </span>
                          <span className='text-[15px]'>{day}</span>
                        </div>
                        {
                          isActive && <div className='pb-4'>
                            <div className='grid grid-cols-2 md:grid-cols-4 gap-2 p-3 pt-1'>
                              {DAYPARTS?.map(part=>(
                                <label className='bg-black-950 rounded-xl border-1 border-gray hover:bg-[#5275e0]' key={part}>
                                  <input type="checkbox" className='peer sr-only' name={day} value={part} checked={activeDayparts[day]?.includes(part)} onChange={toggleDayPart}/>
                                  <div className='bg-black-950 p-2 rounded-xl hover:bg-[#5275e0] peer peer-checked:bg-blue-600'>{part}</div>
                                </label>)
                              )}
                            </div>
                            <div className='text-white-250 text-xs flex flex-col'>
                              <span>Morning: 6:00 AM - 12:00 PM</span>
                              <span>Afternoon: 12:00 PM - 5:00 PM</span>
                              <span>Evening: 5:00 PM - 9:00 PM</span>
                              <span>Night: 9:00 PM - 6:00 AM</span>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <footer className='sticky bottom-0 w-full border-t-1 border-gray bg-[#17191CCC] p-4 backdrop-blur-lg'>
            <button className='p-2 w-full rounded-xl bg-blue-750 hover:bg-blue-800 active:bg-blue-900' onClick={setWeeklyAvailability}>Save Availability</button>
          </footer>
        </>
      }

    </div>
  )
}

export default Availability 
