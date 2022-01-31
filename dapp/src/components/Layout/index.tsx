import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }: { children: React.ReactNode }) => {
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
