import './globals.css';  // You can import global styles here
import { Inter } from 'next/font/google';
import Header from './header';
import Head from 'next/head';  // Import Head
import { LoadingProvider } from './loadingContext';

// Example of using a Google font (Inter)
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
  
          {/* Global title (can be overwritten on a per-page basis) */}
          <title>Həyat qısa, dəyməz qıza</title>
          <meta name="description" content="My Next.js Application" />
          {/* You can add other meta tags here */}
      
      </head>
      <body className={inter.className}>
      <LoadingProvider>
      <Header />
        {/* The 'children' will render the content of your pages */}
        {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
