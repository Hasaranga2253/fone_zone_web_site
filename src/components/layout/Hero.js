// src/components/layout/Hero.js
import React from 'react';
import { FaMobileAlt } from 'react-icons/fa'; // ✅ Import icon

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg mb-6">
      {/* 🔁 Background promo video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
        src="/videos/fonezone-promo.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* 🌈 Overlay content */}
      <div className="relative z-10 text-center py-20 px-4 bg-gradient-to-r from-blue-800/70 via-indigo-800/70 to-purple-800/70 backdrop-blur-sm rounded-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 animate-glow">
          📱 Welcome to <span className="text-cyan-400">FoneZone</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
          The Future of Mobile Shopping, Repairs & Delivery
        </p>

        {/* ✅ CTA Button with Icon */}
        <button className="bg-blue-600 hover:bg-blue-800 transition-all px-6 py-2 rounded-full shadow-lg hover:scale-105 text-white text-lg flex items-center gap-2 mx-auto">
          <FaMobileAlt className="text-pink-400 animate-bounce" />
          Shop Now 🚀
        </button>
      </div>
    </div>
  );
}

export default Hero;
