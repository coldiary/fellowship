import React from 'react';
// import { AccountContext, useAccountContext } from 'contexts/Account';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  // const accountContextValue = useAccountContext();

  return (
    // <AccountContext.Provider value={accountContextValue}>
      <div className='bg-gray-50 flex flex-col min-h-screen min-w-screen'>
        <Navbar />
        <main className='flex flex-column flex-auto'>
          {children}
        </main>
        <Footer />
      </div>
    // </AccountContext.Provider>
  );
};

export default Layout;
