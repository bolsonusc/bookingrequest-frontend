
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async()=>{
    const token = sessionStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user-by-token`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const { user: authUser, error } = await res.json();
      if(error){
        await validateToken();
      }
      setUser(authUser);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  const validateToken = async()=>{
    const token = sessionStorage.getItem('token');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/validate-token`, {
        method: 'POST',
        body: JSON.stringify({
          token
        }),
        headers: {
          'Content-type': 'application/json'
        }
      });
      const { user_id, error } = await res.json();
      if(!error) setIsValidToken(true);
      else {
        await refreshToken()
      };
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  const refreshToken = async()=>{
    const rToken = sessionStorage.getItem('refreshToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
        method: 'POST',
        body: JSON.stringify({
          refresh_token: rToken
        }),
        headers: {
          'Content-type': 'application/json'
        }
      });
      const { error, refreshToken, token } = await res.json();
      if(!error){
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refreshToken', refreshToken);
        await getUser();
      } else {
        router.push('/auth/login');
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const logout = ()=>{
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    setUser(null);
  }

  return {
    user,
    loading,
    isValidToken,
    refreshToken,
    logout
  }

}
