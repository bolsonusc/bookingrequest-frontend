import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {


    const router = useRouter();


    return (
        <>
            <Head>
                <title>Privacy Policy</title>
                <meta name="description" content="Contact Information" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="min-h-screen  bg-black ">

                {/* ===== MAIN PAGE ===== */}
                <div className='  flex flex-col mx-auto justify-center w-[90vw] p-4 rounded-xl '>
                    <h1 className='text-white text-[30px] font-bold mb-4 pt-10'>Privacy Policy</h1>
                    <div className='text-white-200 flex flex-col gap-3 pb-10'>
                        <p><b className='font-semibold'>Effective Date:</b> July 12, 2025</p>
                        <p>This Privacy Policy describes how "Booking Request" ("we," "us," or "our") collects, uses,
                            and shares information about you when you use our mobile application (the "App"). By using
                            our App, you agree to the collection, use, and sharing of your information as described in
                            this Privacy Policy.</p>
                        <h3 className='text-[20px] text-white font-semibold'>Information We Collect</h3>
                        <p>We collect information you provide directly to us, information we collect automatically when
                            you use our App, and information from third parties.</p>
                        <h4 className='text-[16px] text-white font-semibold mt-3'>Information You Provide to Us:</h4>
                        <ul className='list-disc pl-5'>
                            <li><b className='font-semibold'>Account Information:</b> When you create an account, we may collect your name,
                                email address, phone number, and a password.</li>
                            <li><b className='font-semibold'>Booking Information:</b> When you make a booking request, we collect information
                                necessary to fulfill the request, which may include the date, time, and details of the
                                service requested.</li>
                            <li><b className='font-semibold'>Images and Logos:</b> To personalize your experience and for specific booking
                                functionalities, we may ask you to upload images or logos. This requires access to
                                your device's camera and/or storage.</li>
                        </ul>

                        <h4 className='text-[16px] text-white font-semibold mt-3'>Information We Collect Automatically:</h4>
                        <ul className='list-disc pl-5'>
                            <li><b className='font-semibold'>Device and Usage Information:</b> We collect information about your mobile device
                                and your use of our App, including your IP address, device type, operating system,
                                and App version.</li>
                            <li><b className='font-semibold'>Internet Access:</b> Our App requires an internet connection to communicate with our
                                servers and third-party services to process booking requests and other
                                functionalities.</li>
                        </ul>

                        <h3 className='text-[20px] text-white font-semibold mt-3'>How We Use Your Information</h3>
                        <p>We use the information we collect for various purposes, including to:</p>
                        <ul className='list-disc pl-5'>
                            <li>Provide, maintain, and improve our App and services.</li>
                            <li>Process your booking requests and send you related information, including confirmations and reminders</li>
                            <li>Communicate with you about your account, our services, and promotional offers.</li>
                            <li>Personalize your experience within the App, such as by displaying your uploaded
                                images or logos.</li>
                            <li>Analyze how users interact with our App to improve its functionality and user
                                experience.</li>
                            <li>Detect, prevent, and address technical issues and security vulnerabilities.</li>
                        </ul>
                        <h3 className='text-[20px] text-white font-semibold mt-3'>Sharing of Your Information</h3>
                        <p>We may share your information in the following circumstances:</p>
                        <ul className='list-disc pl-5'>
                            <li><b className='font-semibold'>With Service Providers:</b> We may share your information with third-party vendors,
                                consultants, and other service providers who need access to such information to
                                carry out work on our behalf.</li>
                            <li><b className='font-semibold'>For Legal Reasons:</b> We may disclose your information if we believe that disclosure
                                is in accordance with, or required by, any applicable law, regulation, or legal process</li>
                            <li><b className='font-semibold'>With Your Consent:</b> We may share your information for any other purpose with your
                                consent.</li>
                        </ul>
                        <p>We do not sell your personal information to third parties.</p>
                        <h3 className='text-[20px] text-white font-semibold mt-3'>Your Choices and Rights</h3>
                        <p>You have certain choices and rights regarding the information we collect and use:</p>
                        <ul className='list-disc pl-5'>
                            <li><b className='font-semibold'>Account Information:</b> You may update or correct your account information at any time by accessing your account settings within the App.</li>
                            <li><b className='font-semibold'>Camera and Storage Access:</b> You can control the App's access to your device's camera and storage through your device's settings. Please note that disabling these
                                permissions may limit your ability to use certain features of the App, such as
                                uploading images or logos.</li>
                            <li><b className='font-semibold'>Promotional Communications:</b> You may opt out of receiving promotional
                                communications from us by following the instructions in those communications.
                            </li>
                        </ul>
                        <h3 className='text-[20px] text-white font-semibold mt-3'>Data Security</h3>
                        <p>We take reasonable measures to help protect information about you from loss, theft, misuse,
                            and unauthorized access, disclosure, alteration, and destruction.</p>
                        <h3 className='text-[20px] text-white font-semibold mt-3'>Children's Privacy</h3>
                        <p>Our App is not intended for use by children under the age of 13. We do not knowingly collect
                            personal information from children under 13. If we learn that we have collected personal
                            information from a child under 13, we will take steps to delete the information as soon as
                            possible.</p>
                        <h3 className='text-[20px] text-white font-semibold mt-3'>Changes to This Privacy Policy</h3>
                        <p>We may update this Privacy Policy from time to time. If we make material changes, we will
                            notify you by revising the date at the top of the policy and, in some cases, we may provide
                            you with additional notice (such as adding a statement to our homepage or sending you a
                            notification). We encourage you to review the Privacy Policy whenever you access the App
                            to stay informed about our information practices and the choices available to you.</p>
                        <h3 className='text-[20px] text-white font-semibold mt-3'>Contact Us</h3>
                        <p>If you have any questions about this Privacy Policy, please contact us at: <a href='mailto:support@example.com' className='text-blue-500'>support@example.com</a></p>
                    </div>
                </div>
            </div>
        </>
    );
}
export default PrivacyPolicy;