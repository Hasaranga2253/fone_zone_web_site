import React from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './Navbar';
import Hero from './Hero';
import FeaturedSection from './FeaturedSection';
import Footer from './Footer'; 

function Layout({ children }) {
  const location = useLocation();

  const showTopSections = location.pathname === '/' || location.pathname === '/shop';

  return (
   <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 text-white">
      {/* 🔝 Navigation */}
      <Navbar />

      {/* 🌟 Only show Hero & Featured on specific routes */}
      {showTopSections && (
        <>
          <Hero />
          <FeaturedSection />
        </>
      )}

      {/* 📦 Main content wrapper */}
      <main className="flex-grow px-4 py-6 sm:px-6 overflow-y-auto">
        {children}
      </main>

      {/* 🔔 Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover={false} />

      {/* 🧩 Optional Footer if needed */}
      <Footer />
    </div>
  );
}

export default Layout;
