import { ArrowLeft, Check, Eye, LayoutDashboard, MapPin, Settings, Upload, X } from 'lucide-react'
import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../src/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getId } from '../profile'

const EditProfile = () => {

  const {loading} = useAuth();
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);
  const [image, setImage] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const [details, setDetails] = useState<any>({});

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setImage(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    imageRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewAvatar(null);
    if (imageRef.current) {
      imageRef.current.value = '';
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setLogo(file);
    setPreviewLogo(URL.createObjectURL(file));
  };

  const handleUploadLogoClick = (e) => {
    e.preventDefault();
    logoRef.current?.click();
  };

  const handleRemoveLogo = () => {
    setLogo(null);
    setPreviewLogo(null);
    if (logoRef.current) {
      logoRef.current.value = '';
    }
  };

  const onChange = (e)=>{
    setDetails(prev=>({
      ...prev,
      [e.target.name] : e.target.value 
    }));
  }

  const getDetails = async () => {
    const token = sessionStorage.getItem('token');
    const id = await getId();
    try {
      // Get provider details by id
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/providers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*'
        }
      });
      const data = await res?.json();
      if (data?.error) {
        throw data?.error;
      }
      data?.user?.avatar && setPreviewAvatar(data?.user?.avatar);
      data?.business_logo && setPreviewLogo(data?.business_logo);
      setUserDetails(data);
    } catch (error) {
      console.error(error);
    }
  }

  const saveProfile = async()=>{
    const token = sessionStorage.getItem('token');
    const formData = new FormData();
    try {
      // Get provider details by id
      Object.keys(details).forEach((key) => { 
        formData.append(key, details[key]);
      });
      if(logo){
        formData.append('business_logo', logo);
      }
      if(image){
        formData.append('avatar', image);
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/providers/me/settings`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*'
        },
        body: formData
      });
      const data = await res?.json();
      if (data?.error) {
        throw data?.error;
      }
      alert(data?.message || 'Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert(error);
    }
    router.back();
  }

  useEffect(()=>{
    getDetails();
  }, [])

  return (
    <div className='bg-[#0B0C0E] text-white flex flex-col items-center'>
      <Head>
        <title>Profile</title>
        <meta name="description" content="User Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ===== HEADER BAR ===== */}
      <header className="h-[65px] text-center sticky top-0 backdrop-blur-xs bg-[#0B0C0ECC] border-b-1 border-gray flex flex-row items-center justify-evenly w-full px-10">
        <button className='basis-2/100 w-8 cursor-pointer' onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <p className='font-normal text-lg leading-7 text-white-950 basis-90/100'>Public Profile Preview</p>
        <div className='flex gap-5'>
          <Link href={'/dashboard/provider'}> <LayoutDashboard size={20}/></Link>
          <Link href={'/settings'}> <Settings size={20}/></Link>
        </div>
      </header>

      {/* ===== MAIN CARD ===== */}
      { loading ? 
        <div className="min-h-screen min-w-screen bg-black flex items-center justify-center text-white">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div> :
        <div className='my-8 w-full text-center'>
          <form className='mb-8 flex flex-col items-center' encType='multipart/form-data'>
            {(previewAvatar) ? (
              <div className="relative">
                <img src={previewAvatar} alt="Uploaded Image" className="w-32 h-32 object-cover rounded-full" />
                <button type='button' onClick={handleRemoveImage} className="absolute -top-3 -right-3 bg-black text-white rounded-full p-1 hover:bg-gray-700" >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-[#22252a] rounded-full flex items-center justify-center text-gray-400 text-3xl cursor-pointer" onClick={handleUploadClick} >
                <Upload size={30}/>
              </div>
            )}
            <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <button className='p-2 px-4 mt-3 border-1 border-gray bg-[#0B0C0E] text-sm rounded-xl max-w-fit' onClick={handleUploadClick}>
              {image ? 'Change Image' : 'Upload Image'}
            </button>
          </form>

          <div className='flex flex-col md:mx-8 text-sm'>
            <label htmlFor='fullname' className='font-semibold'>Full Name</label>
            <input type="text" name="fullname" id="fullname" className='border-1 border-gray m-4 mt-2 p-2 px-4 rounded-xl' placeholder='Full Name' defaultValue={userDetails?.user?.display_name} value={details?.fullname} onChange={onChange}/>
          </div>

          <form encType='multipart/form-data' className='mb-8 flex flex-col items-center'>
            {(previewLogo) ? (
              <div className="relative">
                <img src={previewLogo} alt="Uploaded Logo" className="w-32 h-32 object-cover rounded-xl" />
                <button type='button' onClick={handleRemoveLogo} className="absolute -top-3 -right-3 bg-black text-white rounded-xl p-1 hover:bg-gray-700" >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-[#22252a] rounded-xl flex items-center justify-center text-gray-400 text-3xl cursor-pointer" onClick={handleUploadLogoClick} >
                <Upload size={30}/>
              </div>
            )}
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            <button className='p-2 px-4 mt-3 border-1 border-gray bg-[#0B0C0E] text-sm rounded-xl max-w-fit' onClick={handleUploadLogoClick}>
              {logo ? 'Change Logo' : 'Upload Logo'}
            </button>
          </form>

          <div className='flex flex-col md:mx-8 text-sm'>
            <label htmlFor='business_name' className='font-semibold'>Business Name <span className='text-white-250 text-xs font-normal'>(optional)</span> </label>
            <input type="text" name="business_name" id="business_name" className='border-1 border-gray m-4 mt-2 p-2 px-4 rounded-xl' placeholder='Business Name' defaultValue={userDetails?.business_name} value={details?.business_name} onChange={onChange}/>

            <label htmlFor='business_url' className='font-semibold'>Business URL <span className='text-white-250 text-xs font-normal'>(optional)</span> </label>
            <input type="text" name="business_url" id="business_url" className='border-1 border-gray m-4 mt-2 p-2 px-4 rounded-xl' pattern="https://.*" placeholder='Business URL' defaultValue={userDetails?.business_url} value={details?.business_url} onChange={onChange}/>

            <label htmlFor='business_license' className='font-semibold'>Business License <span className='text-white-250 text-xs font-normal'>(optional)</span> </label>
            <input type="text" name="business_license" id="business_license" className='border-1 border-gray m-4 mt-2 p-2 px-4 rounded-xl' placeholder='Business License' defaultValue={userDetails?.business_license} value={details?.business_license} onChange={onChange}/>

            <label htmlFor='username' className='font-semibold'>Username</label>
            <input type="text" name="username" id="username" className='border-1 border-gray mx-4 mt-2 p-2 px-4 rounded-xl' placeholder='Username' defaultValue={userDetails?.user?.username} value={details?.username} onChange={onChange}/>
            <span className='text-white-250 text-xs mt-2'>This username will be searchable by clients.</span>
          </div>

          <div className='flex flex-row gap-2 text-blue-800 text-sm font-semibold px-12 mt-6 mb-2'>
            <MapPin size={20}/>
            <p className=''>Location Information</p>
          </div>

          <div className='flex flex-col md:mx-8 text-sm'>
            <label htmlFor='country' className='font-semibold'>Country</label>
            <input type="text" name="country" id="country" className='border-1 border-gray m-4 mt-2 p-2 px-4 rounded-xl' placeholder='Country' defaultValue={userDetails?.user?.country} value={details?.country} onChange={onChange} required/>

            <label htmlFor='state' className='font-semibold'>State/Province</label>
            <input type="text" name="state" id="state" className='border-1 border-gray m-4 mt-2 p-2 px-4 rounded-xl' placeholder='State' defaultValue={userDetails?.user?.state} value={details?.state} onChange={onChange} required/>

            <label htmlFor='city' className='font-semibold'>City</label>
            <input type="text" name="city" id="city" className='border-1 border-gray m-4 mt-2 p-2 px-4 rounded-xl' placeholder='City' defaultValue={userDetails?.user?.city} value={details?.city} onChange={onChange} required/>

            <label htmlFor='description' className='font-semibold'>Bio</label>
            <textarea rows={3} name="description" id="description" className='border-1 border-gray mx-4 mt-2 p-2 px-4 rounded-xl' placeholder='Description/Bio' defaultValue={userDetails?.description} value={details?.description} onChange={onChange} />
          </div>

          <div className='flex gap-3 justify-end mx-12'>
            {/* <button className='border-1 border-gray bg-black mt-4 p-2 rounded-xl text-sm cursor-pointer hover:bg-blue-500/50 active:bg-gray-900 flex gap-2 w-max-content' onClick={() => { router.back() }}> <Eye size={18}/> Preview Public Profile</button> */}
            <button className='bg-blue-750 mt-4 p-2 rounded-xl text-sm cursor-pointer hover:bg-blue-800 active:bg-blue-900 flex gap-2 w-max-content' onClick={saveProfile}>
              <Check size={18}/>
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default EditProfile