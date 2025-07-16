import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async()=>{
    const token = sessionStorage.getItem('token');
    if(!token){
      console.warn('Plese provide token by login or register!');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user-by-token`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*'
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
    if(!token){
      console.warn('Token is not present to validate!');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/validate-token`, {
        method: 'POST',
        body: JSON.stringify({
          token
        }),
        headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*'
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
    if(!rToken){
      console.warn('Refresh token is not present to referesh the authentication!');
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
        method: 'POST',
        body: JSON.stringify({
          refresh_token: rToken
        }),
        headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const { error, refreshToken, token } = await res.json();
      if(!error){
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('refreshToken', refreshToken);
        await getUser();
      } else {
        console.error(error);
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