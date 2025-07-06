import { useAuth } from '../../src/hooks/useAuth';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import NavigateButton from '../../components/settings/NavigateButton';
import { ArrowLeft, Calendar, Clock, CreditCard, Download, Eye, Globe, History, KeyRound, LayoutDashboard, Mail, Receipt, Tags } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className='bg-[#0B0C0E] text-white flex flex-col items-center w-full '>
      <Head>
        <title>Settings</title>
        <meta name="description" content="Settings" />
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
      <header className="h-[65px] w-full sticky top-0 backdrop-blur-xs bg-[#0B0C0ECC] border-b-1 border-gray flex flex-row items-center justify-center text-center">
        <button className='basis-2/100 w-8 cursor-pointer' onClick={()=>router.back()}>
          <ArrowLeft size={20}/>
        </button>
        <p className='font-normal text-lg leading-7 text-white-950 basis-90/100'>Settings</p>
      </header>

      {/* ===== MAIN PAGE ===== */}
      <div className='bg-black-950 my-8 mx-6 flex flex-col justify-center'>
        <NavigateButton title='Dashboard' desc='Return to your dashboard' link={`/dashboard/${user?.role}`} icon={<LayoutDashboard size={16} className='mx-4' />} />
        <span className='text-center my-2 ml-4 text-white-950'>Account Settings</span>
        <NavigateButton title='View Public Profile' desc='See how clients view your profile' link={`/dashboard/profile`} icon={<Eye size={16} className='mx-4' />} />
        <NavigateButton title='Account Status' desc='Set your profile visibility' link={`settings/account-status`} icon={<Globe size={16} className='mx-4' />} />
        <NavigateButton title='Contact Information' desc='Update your email and phone number' link={`settings/contact-infomation`} icon={<Mail size={16} className='mx-4' />} />
        <NavigateButton title='Services Offered' desc='Select the services you provide' link={`#`} icon={<Tags size={16} className='mx-4' />} />
        <NavigateButton title='Invoice Settings' desc='Configure tax rates and invoice defaults' link={`#`} icon={<Receipt size={16} className='mx-4' />} />
        <NavigateButton title='History' desc='View past appointments and activities' link={`#`} icon={<History size={16} className='mx-4' />} />
        <NavigateButton title='Availability' desc='Set your working hours' link={`#`} icon={<Clock size={16} className='mx-4' />} />
        <NavigateButton title='Subscription' desc='Manage your subscription plan' link={`#`} icon={<Calendar size={16} className='mx-4' />} />
        <NavigateButton title='Password' desc='Update your password' link={`#`} icon={<KeyRound size={16} className='mx-4' />} />
        <NavigateButton title='Payment Integration' desc='Connect your Stripe account' link={`#`} icon={<CreditCard size={16} className='mx-4' />} />
        <NavigateButton title='Export Data' desc='Download or email your history' link={`#`} icon={<Download size={16} className='mx-4' />} />
      </div>
    </div>
  );
}