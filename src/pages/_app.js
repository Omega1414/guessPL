// pages/_app.js

import Layout from '@/app/layout'
import Head from 'next/head'



function MyApp({ Component, pageProps }) {
  return (
    <>
    

      
   
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </>
  )
}

export default MyApp