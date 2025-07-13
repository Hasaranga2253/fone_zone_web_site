import React, { useState } from 'react';
import '../../index.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../../components/common/LoginModal';
import Register from '../../components/common/Register';
import Footer from '../../components/layout/Footer';

function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/shop');

  const handleProtectedNavigation = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      setRedirectTo(path);
      setShowLogin(true);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 text-white flex items-center justify-center p-6 relative overflow-hidden">

        {/* 📹 Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: "url('/images/fallback.jpg')" }}
        />

        {/* 🎨 Decorative Overlays */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-5" />
        <div className="absolute top-10 left-10 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-1000" />

        {/* 💎 Glass Card */}
        <div className="glass-card-gradient text-center max-w-3xl w-full p-10 animate-fadeIn z-10 scale-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 gradient-text fade-in">
            Welcome to FoneZone
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto slide-up">
            The future of mobile shopping, repairs & delivery — all in one place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleProtectedNavigation('/shop')}
              className="btn-primary flex items-center gap-2"
            >
               Explore Shop
            </button>
            <button
              onClick={() => handleProtectedNavigation('/user/repair/new')}
              className="btn-secondary flex items-center gap-2"
            >
               Book Repair
            </button>
          </div>
        </div>

        {/* 🔐 Modals */}
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            redirectTo={redirectTo}
            switchToRegister={() => {
              setShowRegister(true);
            }}
          />
        )}
        {showRegister && (
          <Register
            onClose={() => setShowRegister(false)}
            switchToLogin={() => {
              setShowLogin(true);
            }}
          />
        )}
      </div>

      
    </>
  );
}

export default Home;
