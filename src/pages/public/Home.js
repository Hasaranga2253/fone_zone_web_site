import React from 'react';
import '../../index.css'; // ✅ Ensure this points to your global tailwind CSS file

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white flex items-center justify-center p-6">
      <div className="glass-card-gradient text-center max-w-2xl w-full p-10 fade-in shadow-xl">
        
        {/* Main Title with Neon Gradient and Animation */}
        
          <h1 className="text-4xl font-bold animate-glow">
          📱 Welcome to <span className="text-cyan-400">FoneZone</span>
          </h1>
 

        {/* Subtitle with soft fade */}
        <p className="text-lg sm:text-xl text-white/90 fade-in-delayed">
          Your one-stop destination for buying the latest phones, tracking repairs, and managing your orders — all in one place.
        </p>

        {/* Call-to-Action Buttons with Glow Effects */}
        <div className="mt-8 space-x-4 scale-in p-6 animate-fadeIn">
          <a href="/shop" className="btn-primary">🛒 Explore Shop</a>
          <a href="/register" className="btn-secondary">✨ Get Started</a>
        </div>
      </div>
    </div>
    
  );
}

export default Home;
