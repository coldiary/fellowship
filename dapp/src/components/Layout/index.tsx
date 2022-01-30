import React from 'react';
// import { useSignTransactions } from '@elrondnetwork/dapp-core';
// import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  // const { search } = useLocation();

  // const {
  //   callbackRoute,
  //   transactions,
  //   error,
  //   sessionId,
  //   onAbort,
  //   hasTransactions
  // } = useSignTransactions();

  return (
    <div className='bg-gray-50 flex flex-col min-h-screen min-w-screen'>
      <Navbar />
      <main className='flex flex-column flex-auto'>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
