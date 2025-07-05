import { useAuth } from '../../src/hooks/useAuth';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import NavigateButton from '../../components/settings/NavigateButton';

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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7-7m-7 7l7 7" />
          </svg>
        </button>
        <p className='font-normal text-lg leading-7 text-white-950 basis-90/100'>Settings</p>
      </header>

      {/* ===== MAIN PAGE ===== */}
      <div className='bg-black-950 my-8 mx-6 flex flex-col justify-center'>
        <NavigateButton title='Dashboard' desc='Return to your dashboard' link={`/dashboard/${user?.role}`} icon='dashboard' />
        <span className='text-center my-2 ml-4 text-white-950'>Account Settings</span>
        <NavigateButton title='View Public Profile' desc='See how clients view your profile' link={`/dashboard/profile`} icon='eye' />
        <NavigateButton title='Account Status' desc='Set your profile visibility' link={`settings/accountStatus`} icon='globe' />
        <NavigateButton title='Contact Information' desc='Update your email and phone number' link={`settings/contact-infomation`} icon='mail' />
        <NavigateButton title='Services Offered' desc='Select the services you provide' link={`#`} icon='services' />
        <NavigateButton title='Invoice Settings' desc='Configure tax rates and invoice defaults' link={`#`} icon='invoice' />
        <NavigateButton title='History' desc='View past appointments and activities' link={`#`} icon='history' />
        <NavigateButton title='Availability' desc='Set your working hours' link={`#`} icon='clock' />
        <NavigateButton title='Subscription' desc='Manage your subscription plan' link={`#`} icon='calendar' />
        <NavigateButton title='Password' desc='Update your password' link={`#`} icon='key' />
        <NavigateButton title='Payment Integration' desc='Connect your Stripe account' link={`#`} icon='wallet' />
        <NavigateButton title='Export Data' desc='Download or email your history' link={`#`} icon='download' />
      </div>
    </div>
  );
}