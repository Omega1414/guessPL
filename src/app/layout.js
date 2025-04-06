import './globals.css';  // You can import global styles here
import { Roboto_Mono } from 'next/font/google';
import Header from './header';

import { LoadingProvider } from './loadingContext';

export const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto-mono",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en"  className={`${robotoMono.variable}  `}>
      <head>
  
          {/* Global title (can be overwritten on a per-page basis) */}
          <title>Həyat qısa, dəyməz qıza</title>
          <meta name="description" content="My Next.js Application" />
          {/* You can add other meta tags here */}
      
      </head>
      <body
       
      >
      <LoadingProvider>
      <Header />
        {/* The 'children' will render the content of your pages */}
        {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
