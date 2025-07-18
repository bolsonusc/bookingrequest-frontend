import { ArrowLeft, CircleAlert, CreditCard, Info } from 'lucide-react'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import React from 'react'

const Payment = () => {

  const router = useRouter();

  const connectToStripe = ()=>{
    console.log('Connected to stripe');
  }

  return (
    <div className='bg-[#0B0C0E] text-white-950'>
      <Head>
        <title>Payment Integration</title>
        <meta name="description" content="Payment Integration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ===== HEADER BAR ===== */}
      <header className="h-[65px] text-center sticky top-0 backdrop-blur-xs bg-[#0B0C0ECC] border-b-1 border-gray flex flex-row items-center justify-center w-full">
        <button className='basis-2/100 w-8 cursor-pointer' onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <p className='font-normal text-lg leading-7 text-white-950 basis-90/100'>Payment Integration</p>
      </header>

      {/* ===== MAIN CARD ===== */}
      <div className='items-center p-4 text-center min-h-screen'>
        <h2 className='text-[#1D4FD7] text-lg m-2 flex items-center gap-2'><CreditCard color='#1D4FD7' size={18}/> Stripe integration</h2>
        <div className='border-1 border-gray text-[13px] p-4 rounded-xl mb-3'>
          <p className='flex gap-2 justify-center items-center'>
            <CircleAlert size={16} />
            <span className='basis-98/100 font-semibold text-base'>Connect Your Stripe Account</span>
          </p>
          <p className='text-sm p-1'>To receive payments from clients, you need to connect your Stripe account.</p>
        </div>
        <button className='w-full p-3 my-4 bg-blue-750 hover:bg-blue-800 text-sm rounded-xl' onClick={connectToStripe}>Connect stripe account</button>
      </div>
    </div>
  )
}

export default Payment