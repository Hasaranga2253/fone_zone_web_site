import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../common/LoginModal';
import Register from '../common/Register';
import SearchBar from './SearchBar';

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

  // 🔐 Redirect to protected page or open login
  const handleProtectedLink = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      setRedirectTo(path);
      setShowLogin(true);
    }
  };

  // 🎯 Navigate to correct dashboard
  const handleDashboardRedirect = () => {
    if (!currentUser) return;
    const dashboards = {
      admin: '/admin/dashboard',
      user: '/user/dashboard',
      employee: '/employee/dashboard',
    };
    const path = dashboards[currentUser.role] || '/';
    navigate(path);
  };

  // 🚪 Logout and go to home
  const handleLogout = () => {
    logout();
    localStorage.removeItem('adminLoggedIn');
    navigate('/home');
  };

  return (
    <>
      <nav className="nav-blur fixed top-0 left-0 right-0 z-50 px-4 py-3 shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          {/* 🔹 Logo + Search */}
          <div className="flex items-center gap-4 flex-wrap">
            <img
              src="/images/FoneZoneLogo.png"
              alt="FoneZone Logo"
              className="h-10 w-10 rounded-md shadow-lg"
            />
            <h1 className="text-2xl font-bold gradient-text drop-shadow-md">FoneZone</h1>
            {currentUser && (
              <div className="hidden md:block ml-2">
                <SearchBar />
              </div>
            )}
          </div>

          {/* 🔹 Navigation Links */}
          <div className="flex items-center gap-5 text-sm sm:text-base flex-wrap">
            <Link to="/home" className="hover:text-cyan-400 transition"><u>Home</u></Link>
            <button onClick={() => handleProtectedLink('/shop')} className="hover:text-cyan-400 transition"><u>Shop</u></button>
            <button onClick={() => handleProtectedLink('/cart')} className="relative hover:text-cyan-400 transition">
              <u>Cart</u>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 🎯 Dashboard */}
            {currentUser && (
              <button
                onClick={handleDashboardRedirect}
                className="hover:text-cyan-400 transition underline"
              >
                {currentUser.role === 'admin' && 'Admin Dashboard'}
                {currentUser.role === 'user' && 'User Dashboard'}
                {currentUser.role === 'employee' && 'Employee Dashboard'}
              </button>
            )}

            {/* 🔐 Auth Actions */}
            {currentUser ? (
              <>
                <span className="font-medium text-yellow-200 whitespace-nowrap">
                  👤 {currentUser.username || currentUser.email}{' '}
                  <span className="text-xs uppercase">({currentUser.role})</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition text-white text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-full hover:from-cyan-600 hover:to-blue-700 transition text-white"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 🔐 Modals */}
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
