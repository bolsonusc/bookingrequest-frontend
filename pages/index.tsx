import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "../src/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {

  const { user } = useAuth();
  const router = useRouter();

  useEffect(()=>{
    const timer = setTimeout(async () => {
      if(user){
        if(!user?.username){
          router.push('/auth/onboarding');
        } else if(!user?.role) {
          router.push('/auth/role-select');
        } else if(!user.email){
          router.push('/auth/2fa-security');
        } else if(user) {
          router.push(`/dashboard/${user?.role}`);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [user, router]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Auth System</title>
        <meta name="description" content="Authentication system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h1 className="text-4xl font-bold text-center text-white mb-2">
            Welcome
          </h1>
          <p className="text-center text-white-200">
            Please login or create a new account
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/auth/login"
            className="btn-blue"
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;