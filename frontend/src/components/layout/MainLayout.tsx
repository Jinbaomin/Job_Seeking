import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className='bg-gray-50 mt-10'>
        <main className="flex-1 max-w-[90%] mx-auto px-4 py-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout; 