// src/components/Navbar.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../common/LoginModal';
import Register from '../common/Register';
import SearchBar from './SearchBar';
import {
  FaBars, FaTimes, FaHome, FaStore, FaShoppingCart,
  FaHeadset, FaUserCircle, FaUserCog, FaSignOutAlt, FaSearch,
  FaInfoCircle
} from 'react-icons/fa';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/shop');
  const [searchVisible, setSearchVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // NEW

  // Update cart count
  useEffect(() => {
    if (!currentUser) return setCartCount(0);
    const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.email}`)) || [];
    setCartCount(cart.reduce((sum, i) => sum + (i.quantity || 1), 0));
  }, [currentUser]);

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const username = currentUser
    ? currentUser.role === 'admin'
      ? 'Hasaranga'
      : currentUser.username || currentUser.email.split('@')[0]
    : '';

  const handleProtected = (path) => {
    if (currentUser) navigate(path);
    else { setRedirectTo(path); setShowLogin(true); }
    setMobileOpen(false);
  };

  const handleDashboard = () => {
    if (!currentUser) return;
    const roles = {
      admin: '/admin/dashboard',
      user: '/user/dashboard',
      employee: '/employee/dashboard',
    };
    navigate(roles[currentUser.role] || '/');
    setMobileOpen(false);
  };

  const confirmLogout = () => {
    logout();
    localStorage.removeItem('admin');
    localStorage.removeItem('adminLoggedIn');
    navigate('/home');
    setMobileOpen(false);
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* Navbar (hidden when mobile menu is open) */}
      {!mobileOpen && (
        <nav className={`fixed top-0 w-full z-50 transition-all ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            {/* Logo */}
            <Link to="/home" onClick={() => setMobileOpen(false)} className="flex items-center space-x-2">
              <img src="/images/FoneZoneLogo.png" alt="FoneZone Logo" className="h-10 w-10 rounded-md shadow-lg" />
              <h4 className="text-xl font-bold gradient-text">FoneZone</h4>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              <NavButton icon={<FaHome />} label="Home" to="/home" scrolled={scrolled} />
              <NavButton icon={<FaStore />} label="Shop" onClick={() => handleProtected('/shop')} scrolled={scrolled} />
              
              {currentUser && (
              <NavButton icon={<FaShoppingCart />}label="Cart"onClick={() => handleProtected('/cart')} scrolled={scrolled} badge={cartCount}/>)}
              {currentUser?.role === 'user' && (
                <NavButton icon={<FaHeadset />} label="Support" onClick={() => navigate('/user/ContactSupport')} scrolled={scrolled} />
              )}
              <NavButton icon={<FaInfoCircle />} label="About" to="/about" scrolled={scrolled} />
            </div>

            {/* Right side (Search & Auth) */}
            <div className="hidden md:flex items-center space-x-4">
              {searchVisible && <div className="w-64"><SearchBar /></div>}
              {currentUser && <IconButton icon={<FaSearch />} scrolled={scrolled} onClick={() => setSearchVisible(!searchVisible)} />}
              {currentUser ? (
                <UserMenu
                  username={username}
                  currentUser={currentUser}
                  scrolled={scrolled}
                  onDashboard={handleDashboard}
                  onLogout={() => setShowLogoutConfirm(true)} // Trigger confirmation
                />
              ) : (
                <AuthButton scrolled={scrolled} onClick={() => setShowLogin(true)} />
              )}
            </div>

            {/* Mobile Nav Buttons */}
            <div className="flex md:hidden items-center space-x-4">
              <IconButton icon={<FaShoppingCart />} scrolled={scrolled} onClick={() => handleProtected('/cart')} badge={cartCount} />
              {currentUser && <IconButton icon={<FaSearch />} scrolled={scrolled} onClick={() => setSearchVisible(!searchVisible)} />}
              <IconButton icon={mobileOpen ? <FaTimes /> : <FaBars />} scrolled={scrolled} onClick={() => setMobileOpen(!mobileOpen)} />
            </div>
          </div>
          {searchVisible && <div className="mt-3 md:hidden px-4"><SearchBar /></div>}
        </nav>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl rounded-l-xl z-50">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <Link to="/home" onClick={() => setMobileOpen(false)} className="flex items-center space-x-2">
                <img src="/images/FoneZoneLogo.png" alt="FoneZone Logo" className="h-10 w-10 rounded-md shadow-lg" />
                <h4 className="text-xl font-bold gradient-text">FoneZone</h4>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <FaTimes />
              </button>
            </div>

            {/* User Info */}
            {currentUser && (
              <div className="p-5 flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-medium">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{username}</p>
                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                </div>
              </div>
            )}

            {/* Links */}
            <div className="p-5 space-y-1">
              <Link to="/home" onClick={() => setMobileOpen(false)} className="flex items-center p-3 text-gray-700 hover:bg-blue-50 rounded-lg"><FaHome className="mr-3" /> Home</Link>
              <button onClick={() => handleProtected('/shop')} className="flex items-center w-full p-3 text-gray-700 hover:bg-blue-50 rounded-lg"><FaStore className="mr-3" /> Shop</button>
              <Link to="/about" onClick={() => setMobileOpen(false)} className="flex items-center p-3 text-gray-700 hover:bg-blue-50 rounded-lg"><FaInfoCircle className="mr-3" /> About</Link>
              {currentUser && (
                <button onClick={() => handleProtected('/cart')} className="flex items-center w-full p-3 text-gray-700 hover:bg-blue-50 rounded-lg"><FaShoppingCart className="mr-3" /> Cart{cartCount > 0 && <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">{cartCount} items</span>}</button>
              )}
              {currentUser?.role === 'user' && (
                <button onClick={() => { navigate('/user/ContactSupport'); setMobileOpen(false); }} className="flex items-center w-full p-3 text-gray-700 hover:bg-blue-50 rounded-lg"><FaHeadset className="mr-3" /> Support</button>
              )}
              {currentUser && (
                <button onClick={handleDashboard} className="flex items-center w-full p-3 text-gray-700 hover:bg-blue-50 rounded-lg"><FaUserCog className="mr-3" /> {currentUser.role === 'admin' ? 'Admin Dashboard' : currentUser.role === 'employee' ? 'Employee Dashboard' : 'User Dashboard'}</button>
              )}
              {currentUser ? (
                <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center w-full p-3 text-gray-700 hover:bg-blue-50 rounded-lg"><FaSignOutAlt className="mr-3" /> Logout</button>
              ) : (
                <button onClick={() => setShowLogin(true)} className="w-full flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><FaUserCircle className="mr-2" /> Login / Register</button>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 px-5">
              <h3 className="text-xs font-medium text-gray-900 uppercase mb-2">Contact Us</h3>
              <p className="text-sm text-gray-600">support@fonezone.com</p>
              <p className="text-sm text-gray-600 mt-1">+94 (718) 822-672</p>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Are you sure you want to log out?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modals */}
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

/* Helper Components (unchanged) */
function NavButton({ icon, label, to, onClick, scrolled, badge }) {
  const base = scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10';
  const Element = to ? Link : 'button';
  return (
    <Element to={to} onClick={onClick} className={`px-4 py-2 rounded-lg flex items-center relative ${base}`}>
      {icon} <span className="ml-2">{label}</span>
      {badge > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{badge}</span>}
    </Element>
  );
}
function IconButton({ icon, onClick, scrolled, badge }) {
  return (
    <button onClick={onClick} className={`p-2 relative rounded-full ${scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}>
      {icon}
      {badge > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{badge}</span>}
    </button>
  );
}
function UserMenu({ username, currentUser, scrolled, onDashboard, onLogout }) {
  return (
    <div className="flex items-center space-x-3">
      <button onClick={onDashboard} className={`px-3 py-1 rounded-full flex items-center ${scrolled ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-white/10 text-white'}`}>
        <FaUserCog className="mr-1" /> <span className="text-sm">{currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'employee' ? 'Employee' : 'Dashboard'}</span>
      </button>
      <div className="relative group">
        <button className="flex items-center space-x-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm">{username.charAt(0).toUpperCase()}</div>
          <span className={`${scrolled ? 'text-gray-700' : 'text-white'} font-medium`}>{username}</span>
        </button>
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 hidden group-hover:block z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{username}</p>
            <p className="text-xs text-gray-500">{currentUser.email}</p>
          </div>
          <button onClick={onLogout} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <FaSignOutAlt className="mr-2" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
function AuthButton({ scrolled, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg flex items-center ${scrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white/10 text-white hover:bg-white/20'}`}>
      <FaUserCircle className="mr-2" /> Login
    </button>
  );
}

export default Navbar;
