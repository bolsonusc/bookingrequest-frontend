import { ArrowLeft, ChevronDown, ChevronUp, Clock, Info } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import CustomRadio from '../../components/utils/CustomRadioButton';
import CustomSwitchButton from '../../components/utils/CustomSwitchButton';
import { DAYPARTS, WEEKDAYS } from '../../components/utils/constants';

type BreakSlot = { from: string; to: string };

const Availability = () => {
  const router  = useRouter();
  const [mode, setMode] = useState('Business Hours');
  const [activeDays, setActiveDays] = useState(WEEKDAYS.slice(0, 5));
  const [expandedDays, setExpandedDays] = useState([]);
  const [schedule, setSchedule] = useState<Record<
    string,
    {
      start: string;
      end: string;
      breaks: BreakSlot[];
    }
    >>({});
  const [activeDayparts, setActiveDayparts] = useState(DAYPARTS.slice(0,2));

  const handleBreakChange = (day: string, index: number, key: 'from' | 'to', value: string) => {
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

  const addBreak = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        breaks: [...(prev[day]?.breaks || []), { from: '12:00', to: '13:00' }],
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
    !activeDays?.includes(val) ? setActiveDays((prev)=>[...prev, val]) : setActiveDays(prev=> prev?.filter(day => day != val));
  }

  const toggleDayPart=(val:string)=>{
    console.log(val);
    !activeDayparts?.includes(val) ? setActiveDayparts((prev)=>[...prev, val]) : setActiveDayparts(prev=> prev?.filter(day => day != val));
    console.log(activeDayparts);
  }

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
      <div className='bg-black-950 my-4 mx-6 flex flex-col text-center w-[90vw]'>
        <div className='bg-[#22252A4D] text-[13px] text-white-250 p-4 rounded-xl flex gap-2 items-center mb-3'>
          <Info size={20} color='#1D4FD7'/>
          Set your availability to let clients know when they can book your services.
        </div>
        <h2 className='text-[15px] my-3'>Availability Mode</h2>

        <div className='flex gap-2 w-full'>
          <div className='basis-1/2 border-1 border-gray rounded-xl p-4 flex gap-4 items-start'>
            <CustomRadio name='mode' value='Business Hours' checked={mode === 'Business Hours'} onChange={(e)=> setMode(e.target.value)} id='business_hours'/>
            <div>
              <label htmlFor="business_hours" className='cursor-pointer text-sm'>Business Hours</label>
              <p className='text-xs/7 text-white-250'>Set specific start and end times for each day</p>
            </div>
          </div>
          <div className='basis-1/2 border-1 border-gray rounded-xl p-4 flex gap-4 items-start'>
            <CustomRadio name='mode' value='Day Parts' checked={mode === 'Day Parts'} onChange={(e)=>setMode(e.target.value)} id={2}/>
            <div>
              <label htmlFor="business_hours" className='cursor-pointer text-sm'>Day Parts</label>
              <p className='text-xs/7 text-white-250'>Choose morning, afternoon, evening, or night availability</p>
            </div>
          </div>
        </div>

        <div className='my-4'>
          { WEEKDAYS.map(day=>{
              const isExpanded = expandedDays?.includes(day);
              const isActive = activeDays?.includes(day);
              return(
                mode === 'Business Hours' ?
                <div key={day} className='border-1 border-[#FFFFFF1A] bg-[#17191CE5] rounded-xl  shadow-lg backdrop-blur-md my-2'>
                  <div className='w-full flex gap-3 justify-between border-b-1 p-4 border-[#FFFFFF1A]' onClick={()=>toggleExpandedDay(day)}>
                    <div className='flex items-center gap-3'>
                      <CustomSwitchButton value={day} checked={activeDays?.includes(day)} onChange={(e)=> toggleDay(e.target.value)} id={day} />
                      <span className='text-[15px]'>{day}</span>
                    </div>
                    { activeDays?.includes(day) &&
                      <div className='flex items-center gap-3'>
                        <span className='text-white-250 text-[13px]'>09:00 - 17:00</span>
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
                            <input type="time" defaultValue='09:00' 
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
                              defaultValue='17:00'
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
                              value={b?.from}
                              onChange={(e) => handleBreakChange(day, i, 'from', e.target.value)}
                              className="w-full bg-[#22252a] px-4 py-2 text-xs rounded-xl"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="relative w-full">
                              <input
                                type="time"
                                value={b?.to}
                                onChange={(e) => handleBreakChange(day, i, 'to', e.target.value)}
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
                      <span className={`p-2 rounded-xl border-1 border-gray font-medium ${isActive ? 'text-blue-600 bg-[#1d4fd71a]' : 'bg-[#22252a80s]'}`}>{isActive ? 'Available' : 'Unavailable'}</span>
                      <span className='text-[15px]'>{day}</span>
                    </div>
                    {
                      isActive && <div className='pb-4'>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 p-3 pt-1'>
                          {DAYPARTS?.map(part=>(
                            <div className='bg-black-950 rounded-xl border-1 border-gray hover:bg-[#5275e0]' key={part}>
                              <input type="checkbox" className='peer sr-only' name={day} value={part} checked={activeDayparts?.includes(part)} onChange={()=>toggleDayPart(part)}/>
                               <div className='bg-black-950 p-2 rounded-xl hover:bg-[#5275e0] peer peer-checked:bg-blue-600'>{part}</div>
                            </div>
                          ))}
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
        <button className='p-2 w-full rounded-xl bg-blue-750 hover:bg-blue-800 active:bg-blue-900'>Save Availability</button>
      </footer>
    </div>
  )
}

export default Availability
