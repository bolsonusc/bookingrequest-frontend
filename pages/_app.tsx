
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useAuth } from '../src/hooks/useAuth';
// import Layout from '../components/layout';


export default function App({ Component, pageProps }: AppProps) {
  const { loading } = useAuth();

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (

    <Component {...pageProps} />

  )
}
