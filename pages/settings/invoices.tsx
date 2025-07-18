'use client'

import { ArrowLeft, Percent, Upload, X } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import CustomSwitchButton from '../../components/utils/CustomSwitchButton';

const Invoices = () => {
  const router = useRouter();
  const [isEditable, setisEditable] = useState(false);
  const [taxRate, setTaxRate] = useState(10);
  const [defaultTip, setDefaultTip] = useState(true);
  const [defaultTax, setDefaultTax] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Johnson Consulting Group',
    url: 'https://johnsonconsulting.com',
    license: 'JCG-2023-1042'
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file); // Convert file to base64 URL
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onChange = (e)=>{
    console.log(businessInfo);
    setBusinessInfo(prev=>({...prev, [e.target.name]: e.target.value}));
  }

  return (
    <div className='bg-[#0B0C0E] text-white-950'>
      <Head>
        <title>Invoice Settings</title>
        <meta name="description" content="Invoice Settings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ===== HEADER BAR ===== */}
      <header className="h-[65px] text-center sticky top-0 backdrop-blur-xs bg-[#0B0C0ECC] border-b-1 border-gray flex flex-row items-center justify-center w-full">
        <button className='basis-2/100 w-8 cursor-pointer' onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <p className='font-normal text-lg leading-7 text-white-950 basis-90/100'>Invoice Settings</p>
      </header>

      {/* ===== MAIN CARD ===== */}
      <div className='items-center p-4 text-center min-h-screen flex flex-col items-center'>
        <div className='w-2xl bg-[#17191C] border-1 border-gray rounded-xl p-3 my-4'>
          <h2 className='text-xl font-bold mt-4'>Business Information</h2>
          <div className='flex flex-wrap items-center justify-between text-[13px] p-4'>
            <div>
              <p>Use Profile Information</p>
              <p className='text-white-250 py-1'>Use your profile's business name and URL on invoices</p>
            </div>
            <CustomSwitchButton id='edit' checked={!isEditable} value={''} onChange={()=>{setisEditable(prev=>!prev)}}/>
          </div>
          { !isEditable ? 
            <div>
              <label htmlFor="businessName" className='text-sm text-white-250'>Business Name from Profile</label>
              <p className='mb-4'>Johnson Consulting Group</p>
              <label htmlFor="url" className='text-sm text-white-250'>Business URL from Profile</label>
              <p className='mb-4'>https://johnsonconsulting.com</p>
            </div>
            : <div>
                <label htmlFor="name" className='text-sm'>Business Name </label>
                <input
                  type='text'
                  value={businessInfo.name}
                  onChange={onChange}
                  className='w-full bg-black-950 placeholder:text-white-200 focus:outline-none focus:ring-0 focus:border-[#444444] border-1 border-gray rounded-xl px-5 py-3 text-sm mt-1 mb-2'
                  placeholder='Enter your Business Name'
                  id='name'
                  name='name'
                />
                <label htmlFor="url" className='text-sm'>Business URL </label>
                <input
                  type='text'
                  value={businessInfo.url}
                  onChange={onChange}
                  className='w-full bg-black-950 placeholder:text-white-200 focus:outline-none focus:ring-0 focus:border-[#444444] border-1 border-gray rounded-xl px-5 py-3 text-sm mt-1 mb-2'
                  placeholder='Enter your Business URL'
                  id='url'
                  name='url'
                />
            </div>
          }
          <label htmlFor="license" className='text-sm'>Business License (Optional) </label>
          <input
            type='text'
            value={businessInfo.license}
            onChange={onChange}
            className='w-full bg-black-950 placeholder:text-white-200 focus:outline-none focus:ring-0 focus:border-[#444444] border-1 border-gray rounded-xl px-5 py-3 text-sm mt-1 mb-2'
            placeholder='Enter your Business URL'
            id='license'
            name='license'
          />
          <p className='text-xs text-white-250 mb-5'>This will appear on your invoices but not on your profile</p>
          <label htmlFor="businessLogo" className='text-sm'>Business Logo </label>
          <div className='p-4 bg-[#22252A4D] flex flex-col items-center my-2 rounded-xl'>
            {image ? (
              <div className="relative">
                <img src={image} alt="Uploaded Logo" className="w-32 h-32 object-cover rounded-xl" />
                <button onClick={handleRemoveImage} className="absolute -top-3 -right-3 bg-black text-white rounded-full p-1 hover:bg-gray-700" >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-[#22252a] rounded-lg flex items-center justify-center text-gray-400 text-3xl cursor-pointer" onClick={handleUploadClick} >
                <Upload size={30}/>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <button className='p-2 px-4 mt-3 border-1 border-gray bg-[#0B0C0E] text-sm rounded-xl max-w-fit' onClick={handleUploadClick}>
              {image ? 'Change Logo' : 'Upload Logo'}
            </button>
          </div>
          <p className='text-xs text-white-250 my-2'>This logo will appear on your invoices. For best results, use a square image.</p>
        </div>
        <div className='w-2xl bg-[#17191C] border-1 border-gray rounded-xl p-3 my-4'>
          <h2 className='text-xl font-bold mt-4'>Default Tax Settings</h2>
          <div className='flex flex-wrap items-center justify-between text-[13px] p-4'>
            <div>
              <p>Collect Tax by Default</p>
              <p className='text-white-250 py-1'>Automatically enable tax collection on new invoices</p>
            </div>
            <CustomSwitchButton id='defaultTax' checked={defaultTax} value={defaultTax} onChange={()=>{setDefaultTax(prev=>!prev)}}/>
          </div>
          <label htmlFor="taxRate" className={`text-sm ${taxRate > 100 && 'text-red-500/75'}`}>Default Tax Rate (%)</label>
          <div className='p-2 flex flex-col items-center relative w-full'>
            <input type="number" min={0} max={100} name="taxRate" id="taxRate" value={taxRate} onChange={(e)=>setTaxRate(Number(e.target.value))} className={`w-full bg-black-950 text-white-950 placeholder-[#ABB0BA] text-[13px] px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${taxRate>100 ? 'border-red-500/75' : 'border-gray'}`} />
            <Percent size={16} className='absolute right-5 top-1/2 transform -translate-y-1/2 text-white-250'/>
          </div>
          {(taxRate > 100) && <p className='text-sm text-red-500 opacity-75'>Tax rate cannot exceed 100%</p>}
        </div>
        <div className='w-2xl bg-[#17191C] border-1 border-gray rounded-xl p-3 my-4'>
          <h2 className='text-xl font-bold mt-4'>Tipping Options</h2>
          <div className='flex flex-wrap items-center justify-between text-[13px] p-4'>
            <div>
              <p>Enable Tipping by Default</p>
              <p className='text-white-250 py-1'>Allow clients to add tips on invoice payments</p>
            </div>
            <CustomSwitchButton id='defaultTip' checked={defaultTip} value={defaultTip} onChange={()=>{setDefaultTip(prev=>!prev)}}/>
          </div>
        </div>
        <button className='w-2xl mt-4 bg-blue-750 hover:bg-blue-800 active:bg-blue-900 rounded-xl p-3 text-[13px]'>Save Settings</button>
      </div>
    </div>
  )
}

export default Invoices