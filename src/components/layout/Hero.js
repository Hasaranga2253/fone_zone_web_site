import React from 'react';
import { FaMobileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

function Hero() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleShopNow = () => {
    if (!currentUser) {
      toast.info("🛑 Please login to explore the shop.");
      // Optionally trigger login modal here: setShowLogin(true)
      return;
    }

    navigate('/shop');
  };

    return (
      <div className="relative overflow-hidden rounded-b-xl shadow-lg mb-6 mt-0">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          src="/videos/fonezone-promo.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

      <div className="relative z-10 text-center py-20 px-4 bg-gradient-to-r from-blue-800/70 via-indigo-800/70 to-purple-800/70 backdrop-blur-sm rounded-b-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 animate-glow">
           Welcome to <span className="text-cyan-400">FoneZone</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6">
          The Future of Mobile Shopping, Repairs & Delivery
        </p>

      <button
          onClick={handleShopNow}
          className="relative overflow-hidden bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-cyan-400/40 transition-transform duration-300 hover:scale-105"
        >
          {/* 🌟 Glowing pulse ring */}
          <span className="absolute -inset-1 z-0 rounded-full bg-gradient-to-r from-pink-500 via-cyan-500 to-purple-500 opacity-20 blur-2xl animate-pulse" />

          {/* 📱 Icon + Label */}
          <span className="relative z-10 flex items-center gap-2">
            <span className="inline-block animate-bounce">
              <FaMobileAlt className="text-pink-500" />
            </span>
            Shop Now
          </span>
        </button>
      </div>
    </div>
  );
}

export default Hero;
