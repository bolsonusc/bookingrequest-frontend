import Head from 'next/head';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import CustomRadio from '../../components/utils/CustomRadioButton';
import { ArrowLeft, CircleCheckBig, Clock, Globe, Info, Lock } from 'lucide-react';


const AccountStatus = () => {

  const router  = useRouter();
  const [status, setStatus] = useState("public");


  return (
    <div className='bg-[#0B0C0E] text-white flex flex-col items-center'>
      <Head>
        <title>Account Status</title>
        <meta name="description" content="Account Status" />
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
      <header className="w-[90vw] pb-5 pt-10 mx-auto border-b-1 border-gray flex flex-row items-center justify-center text-center">
        <button className='basis-2/100 w-8 cursor-pointer' onClick={()=>router.back()}>
          <ArrowLeft size={20} />
        </button>
        <p className='font-normal text-lg leading-7 text-white-950 basis-90/100'>Account Status</p>
      </header>

      {/* ===== MAIN PAGE ===== */}
      <div className='bg-black-950 my-8 mx-6 flex flex-col justify-center w-[90vw]'>

        <div className='border-2 rounded-xl border-[#F97316] p-4'>
          <div className='flex'>
            <Info size={16} color='#7F1D1D' />
            <h5 className='text-[15px] text-[#F97316] justify-self-center ml-auto md:mr-[45%] mr-[40%] m-1'>Action Required</h5>
          </div>
          <p className='text-[13px] text-center mb-2'>You need an active subscription and a connected Stripe account to set your profile to public or private.</p>
          <button className='bg-[#1D4FD7] rounded-xl border-1 border-[#1D4FD7] px-4 py-2 text-[13px] sm:ml-11 m-2 cursor-pointer'>Subscribe Now</button>
          <button className='bg-[#1D4FD7] rounded-xl border-1 border-[#1D4FD7] px-4 py-2 text-[13px] m-2 cursor-pointer'>Connect Stripe</button>
        </div>

        <div className='bg-[#22252A4D] text-[13px] text-white-250 p-4 rounded-xl flex gap-2 items-center'>
          <Info size={20} color='#1D4FD7'/>
          Control your profile visibility and availability to clients. This setting affects how others see your profile and ability to book your services.
        </div>

        <div className='border-1 rounded-xl border-gray bg-[#17191C] my-6 drop-shadow-sm'>
          <div className='m-6'>

            {/* Public */}
            <div className='my-10 opacity-50'>
              <div className='flex gap-2 items-center my-4'>
                <CustomRadio name={'status'} value={'public'} checked={status === 'public'} onChange={()=> setStatus("public")} id='public' />
                <label htmlFor="public" className='flex gap-2 cursor-pointer'>
                  <Globe size={20} color='#22C55E'/>
                  <span className='text-[15px] text-white-950'>Public</span>
                </label>
              </div>
              <p className='text-center my-4 text-white-250 text-[13px]'>Your profile is visible to everyone. Clients can find and book your services.</p>
              { status==="public" && <p className='text-green-250 my-4 text-[11px] ml-10 flex gap-1'>
                <CircleCheckBig size={14} color='#22C55E' />
                Your profile is currently public
              </p>}
            </div>

            {/* Private */}
            <div className='my-10 opacity-50'>
              <div className='flex gap-2 items-center my-4'>
                <CustomRadio name={'status'} value={'private'} checked={status === 'private'} onChange={()=> setStatus("private")} id='private'/>
                <label htmlFor="private" className='flex gap-2 cursor-pointer'>
                  <Lock size={20} color='#3B82F6' />
                  <span className='text-[15px] text-white-950'>Private</span>
                </label>
              </div>
              <p className='text-center my-4 text-white-250 text-[13px]'>Your profile is only visible to approved contacts. You must manually approve booking requests.</p>
              { status==="private" && <p className='text-[#3B82F6] my-4 text-[11px] ml-10 flex gap-1'>
                <CircleCheckBig size={14} color='#3B82F6' />
                Your profile is currently private
              </p>}
            </div>

            {/* Paused */}
            <div className='my-10'>
              <div className='flex gap-2 items-center my-3'>
                <CustomRadio name={'status'} value={'paused'} checked={status === 'paused'} onChange={()=> setStatus("paused")} id='paused'/>
                <label htmlFor="paused" className='flex gap-2 cursor-pointer'>
                  <Clock size={20} color='#F97316' />
                  <span className='text-[15px] text-white-950'>Paused</span>
                </label>
              </div>
              <p className='text-center my-3 text-white-250 text-[13px]'>Your profile is temporarily hidden. You won't receive any new booking requests until you unpause.</p>
              { status==="paused" && <p className='text-[#F97316] my-4 text-[11px] ml-10 flex gap-1'>
                <CircleCheckBig size={14} color='#F97316' />
                Your profile is currently paused
              </p>}
            </div>
          </div>
        </div>

        <button className='text-[13px] rounded-xl bg-blue-750 p-2 cursor-pointer'>Save Changes</button>
      </div>
    </div>
  )
}

export default AccountStatus;