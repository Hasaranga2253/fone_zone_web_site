// src/components/layout/Layout.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import SearchBar from './SearchBar'; 
import Hero from './Hero';
import FeaturedSection from './FeaturedSection';


function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-800 to-blue-900 text-white animate-fadeIn">

      {/* Top Navigation */}
      <Navbar />

      {/* Optional Top Sections - only show on home/shop pages */}
      {(location.pathname === '/' || location.pathname === '/shop') && (
        <>
          <SearchBar />
          <Hero />
          <FeaturedSection />
        </>
      )}

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 fade-in">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav currentPath={location.pathname} />

      {/* Footer */}
      <footer className="text-center text-sm text-white/60 p-4 border-t border-white/10">
        <p>© 2025 FoneZone. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Layout;
