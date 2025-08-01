'use client'

import { ArrowLeft, Percent, Upload, X } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import CustomSwitchButton from '../../components/utils/CustomSwitchButton';
import { getId } from '../dashboard/profile';

const Invoices = () => {
  const router = useRouter();
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [taxRate, setTaxRate] = useState(0);
  const [defaultTip, setDefaultTip] = useState(true);
  const [defaultTax, setDefaultTax] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [businessInfo, setBusinessInfo] = useState<{
    name: string
    url: string
    license: string
    logo?: string
  }>();
  const [businessName, setBusinessName] = useState('');
  const [businessURL, setBusinessURL] = useState('');
  const [businessLicense, setBusinessLicense] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file); // Convert file to base64 URL
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setBusinessInfo(prev=>({
      ...prev,
      logo: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      setBusinessInfo({
        name : data?.business_name,
        url : data?.business_url,
        license : data?.business_license,
        logo: data?.business_logo
      });
      setDefaultTax(data?.collect_tax_by_default);
      setDefaultTip(data?.enable_tipping_by_default);
      setTaxRate(data?.default_tax_rate);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const saveBusinessInfo = async() => {
    const token = sessionStorage.getItem('token');
    try {
      const formData = new FormData();
      businessName && formData.append('business_name', businessName);
      businessURL && formData.append('business_url', businessURL);
      businessLicense && formData.append('business_license', businessLicense);
      image && formData.append('business_logo', image);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/providers/business-info`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*'
        },
        body: formData
      });
      const data = await res.json();
      if(data?.error){
        throw data?.error;
      }
      await getDetails();
      setIsEditable(false);
      alert(data?.message);
    } catch(error) {
      alert(error);
      console.error(error);
    }
  }

  const saveInvoiceDefaults = async() => {
    const token = sessionStorage.getItem('token');
    try {
      const payload : any = {
        "collect_tax_by_default": defaultTax,
        "enable_tipping_by_default": defaultTip,
        "default_tax_rate": defaultTax ? taxRate : 0
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/providers/invoice-defaults`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if(data?.error){
        throw data?.error;
      }
    } catch(error) {
      alert(error);
      console.error(error);
    }
  } 

  useEffect(()=>{
    getDetails();
  }, []);

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
      { loading ? 
        <div className="min-h-screen min-w-screen bg-black flex items-center justify-center text-white">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div> :
        <div className='items-center p-4 text-center min-h-screen flex flex-col items-center'>
          <div className='w-2xl bg-[#17191C] border-1 border-gray rounded-xl p-3 my-4'>
            <h2 className='text-xl font-bold mt-4'>Business Information</h2>
            <div className='flex flex-wrap items-center justify-between text-[13px] p-4'>
              <div>
                <p>Use Profile Information</p>
                <p className='text-white-250 py-1'>Use your profile's business name and URL on invoices</p>
              </div>
              <CustomSwitchButton id='edit' checked={!isEditable} value={''} onChange={()=>{setIsEditable(prev=>!prev)}}/>
            </div>
            { !isEditable ? 
              <div>
                <label htmlFor="businessName" className='text-sm text-white-250'>Business Name from Profile</label>
                <p className='mb-4'>{businessInfo?.name || 'NA'}</p>
                <label htmlFor="url" className='text-sm text-white-250'>Business URL from Profile</label>
                <p className='mb-4'>{businessInfo?.url || 'NA'}</p>
                <label htmlFor="url" className='text-sm text-white-250'>Business License</label>
                <p className='mb-4'>{businessInfo?.license || 'NA'}</p>
                <p className='text-xs text-white-250 mb-5'>This will appear on your invoices but not on your profile</p>
                <label htmlFor="businessLogo" className='text-sm'>Business Logo </label>
                <div className='p-4 bg-[#22252A4D] flex flex-col items-center my-2 rounded-xl'>
                  {(image || businessInfo?.logo) ?
                    <div className="relative">
                      <img src={image || businessInfo?.logo} alt="Uploaded Logo" className="w-32 h-32 object-cover rounded-xl" />
                    </div> :
                    <div>Upload a Logo to see</div>
                  }
                </div>
              </div>
              : <form encType='multipart/form-data'>
                  <label htmlFor="name" className='text-sm'>Business Name </label>
                  <input
                    type='text'
                    value={businessName || businessInfo?.name}
                    onChange={(e)=>setBusinessName(e.target.value)}
                    className='w-full bg-black-950 placeholder:text-white-200 focus:outline-none focus:ring-0 focus:border-[#444444] border-1 border-gray rounded-xl px-5 py-2 text-sm mt-1 mb-2'
                    placeholder='Enter your Business Name'
                    id='name'
                    required
                  />
                  <label htmlFor="url" className='text-sm'>Business URL </label>
                  <input
                    type='text'
                    value={businessURL || businessInfo.url}
                    onChange={(e)=>setBusinessURL(e.target.value)}
                    pattern='https://.*'
                    className='w-full bg-black-950 placeholder:text-white-200 focus:outline-none focus:ring-0 focus:border-[#444444] border-1 border-gray rounded-xl px-5 py-2 text-sm mt-1 mb-2'
                    placeholder='Enter your Business URL'
                    id='url'
                    required
                  />
                  <label htmlFor="license" className='text-sm'>Business License (Optional) </label>
                  <input
                    type='text'
                    value={businessLicense || businessInfo.license}
                    onChange={(e)=>setBusinessLicense(e.target.value)}
                    className='w-full bg-black-950 placeholder:text-white-200 focus:outline-none focus:ring-0 focus:border-[#444444] border-1 border-gray rounded-xl px-5 py-2 text-sm mt-1 mb-2'
                    placeholder='Enter your Business URL'
                    id='license'
                  />
                  <p className='text-xs text-white-250 mb-5'>This will appear on your invoices but not on your profile</p>
                  <label htmlFor="businessLogo" className='text-sm'>Business Logo </label>
                  <div className='p-4 bg-[#22252A4D] flex flex-col items-center my-2 rounded-xl'>
                    {(image || businessInfo?.logo) ? (
                      <div className="relative">
                        <img src={image || businessInfo?.logo} alt="Uploaded Logo" className="w-32 h-32 object-cover rounded-xl" />
                        <button type='button' onClick={handleRemoveImage} className="absolute -top-3 -right-3 bg-black text-white rounded-full p-1 hover:bg-gray-700" >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-[#22252a] rounded-lg flex items-center justify-center text-gray-400 text-3xl cursor-pointer" onClick={handleUploadClick} >
                        <Upload size={30}/>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <button type='button' className='p-2 px-4 mt-3 border-1 border-gray bg-[#0B0C0E] text-sm rounded-xl max-w-fit' onClick={handleUploadClick}>
                      {image ? 'Change Logo' : 'Upload Logo'}
                    </button>
                  </div>
                  <p className='text-xs text-white-250 my-2'>This logo will appear on your invoices. For best results, use a square image.</p>
              </form>
            }
            {isEditable && <button type='button' className='btn-blue' onClick={saveBusinessInfo}>Save</button>}
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
              <input type="number" min={0} max={100} name="taxRate" id="taxRate" value={taxRate} onChange={(e)=>setTaxRate(Number(e.target.value))} className={`w-full bg-black-950 text-white-950 placeholder-[#ABB0BA] text-[13px] px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${taxRate>100 ? 'border-red-500/75' : 'border-gray'}`} disabled={!defaultTax} required/>
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
          <button className='w-2xl mt-4 bg-blue-750 hover:bg-blue-800 active:bg-blue-900 rounded-xl p-3 text-[13px]' onClick={saveInvoiceDefaults}>Save Settings</button>
        </div>
      }
    </div>
  )
}

export default Invoices