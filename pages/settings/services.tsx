import { ArrowLeft, Check, ChevronDown, Search, Tags } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { SERVICE_LIST } from '../../components/utils/constants';

const Services = () => {
  const router = useRouter();
  const [selected, setSelected] = useState([]);

  const onSelect = (val: string) => {
    !selected?.includes(val) ? setSelected([...selected, val]) : setSelected(selected?.filter(item => item != val));
  }

  return (
    <div className='bg-[#0B0C0E] text-white flex flex-col items-center'>
      <Head>
        <title>Services Offered</title>
        <meta name="description" content="Services Offered" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ===== HEADER BAR ===== */}


      <header className="w-[90vw] pb-5 pt-10 mx-auto border-b-1 border-gray flex flex-row items-center justify-center text-center">
        <button className='basis-2/100 w-8 cursor-pointer' onClick={() => router.back()}>
          <ArrowLeft size={20} color='white' />
        </button>
        <p className='font-normal text-lg leading-7 text-white-950 basis-90/100'>Services Offered</p>
      </header>

      {/* ===== MAIN PAGE ===== */}
      <div className='lg:w-[768px] w-[80vw] bg-black-950 my-8 mx-6 flex flex-col justify-center'>
        <div className='flex flex-wrap justify-between'>
          <div>
            <h2 className='font-bold text-xl'>Select Your Services</h2>
            <p className='text-sm text-white-250'>Choose the services you offer to clients</p>
          </div>
          <span className='text-sm text-white-950'>{selected.length} selected</span>
        </div>

        {/* ===== SEARCH BOX ===== */}
        <div className="relative w-full my-6 shadow-md">
          <Search size={16}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-50"
          />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full bg-black-950 text-white-950 placeholder-[#ABB0BA] text-[13px] pl-10 pr-4 py-3 border-2 border-gray rounded-xl focus:outline-none transition-all"
          />
        </div>

        {/* ===== SERVICES ===== */}
        {
          SERVICE_LIST.map((service, i) => {
            return (
              <details key={i} className='border-b-1 border-gray text-white-950'>
                <summary className='flex gap-2 items-center px-1 py-4 cursor-pointer transition-all text-[15px]'>
                  <Tags size={16} />
                  <h3 role='button'>{service.title}</h3>
                  <ChevronDown size={16} className='ml-auto' />
                </summary>
                <div>
                  {
                    service.services.map((s, key) => {
                      return (
                        <label htmlFor={s} className='cursor-pointer flex items-center justify-between hover:bg-blue-500 rounded-xl p-2 my-1 text-sm'>
                          <div className="relative" key={key}>
                            <input type="checkbox" name={service.title} value={s} checked={selected?.includes(s)} onChange={(e) => onSelect(e.target.value)} className="peer hidden" id={s} />
                            <div className="w-5 h-5 ml-0 rounded-full border-2 border-blue-700 flex items-center justify-center transition-colors duration-300">
                              {selected?.includes(s) && <Check className="w-5 h-5 rounded-full bg-blue-700 opacity-100 peer-checked:opacity-100" />}
                            </div>
                          </div>
                          <span>{s}</span>
                          <div></div>
                        </label>
                      )
                    })
                  }
                </div>
              </details>
            )
          })
        }

        <button className='flex items-center my-8 justify-center gap-3 bg-blue-750 hover:bg-blue-800 active:bg-blue-900 w-full rounded-xl p-3 text-[13px]'><Check size={16} />Save Services</button>

      </div>
    </div>
  )
}

export default Services;