import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../common/LoginModal';
import Register from '../common/Register';

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/shop');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(storedCart.length);
  }, []);

  const handleProtectedLink = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      setRedirectTo(path);
      setShowLogin(true);
    }
  };

  return (
    <>
      <nav className="nav-blur fixed top-0 left-0 right-0 z-50 px-0 py-4 shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Logo & Brand */}
          <div className="flex items-center space-x-2">
            <img
              src="/images/FoneZoneLogo.png"
              alt="FoneZone Logo"
              className="h-10 w-10 rounded-md shadow-lg"
            />
            <h1 className="text-2xl font-bold gradient-text drop-shadow-md">FoneZone</h1>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-sm sm:text-base">
            <Link to="/" className="hover:text-cyan-400 transition"><u>Home</u></Link>

            <button onClick={() => handleProtectedLink('/shop')} className="hover:text-cyan-400 transition">
              <u>Shop</u>
            </button>

            <button onClick={() => handleProtectedLink('/cart')} className="relative hover:text-cyan-400 transition">
              <u>Cart</u>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <>
                {currentUser.role === 'employee' && (
                  <Link to="/employee/repairs" className="hover:text-cyan-400 transition">
                    Manage Repairs
                  </Link>
                )}
                <span className="ml-2 font-medium text-yellow-200">
                  👤 {currentUser.email} <span className="text-xs uppercase">({currentUser.role})</span>
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="ml-2 px-4 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition text-white text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-full hover:from-cyan-600 hover:to-blue-700 transition-all text-white"
                >
                  Login
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Icon (optional dropdown can be added) */}
          <button className="md:hidden">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* 🔐 Auth Modals */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          redirectTo={redirectTo}
          switchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          switchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}

export default Navbar;
