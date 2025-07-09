// components/layout/MobileNav.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiUser, FiLogIn } from 'react-icons/fi';

export default function MobileNav({ currentPath }) {
  const user = JSON.parse(localStorage.getItem('user'));

  const navItems = [
    { to: '/', icon: <FiHome />, label: 'Home' },
    { to: '/shop', icon: <FiShoppingCart />, label: 'Shop' },
    {
      to: user ? '/user/dashboard' : '/login',
      icon: <FiUser />,
      label: user ? 'Account' : 'Login',
    },
    {
      to: '/login',
      icon: <FiLogIn />,
      label: user ? 'Logout' : 'Login',
    },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 text-white flex justify-around items-center py-2 z-50 shadow-md">
      {navItems.map(({ to, icon, label }) => (
        <Link
          to={to}
          key={label}
          className={`flex flex-col items-center gap-1 text-xs transition-all duration-200 ${
            currentPath === to ? 'text-cyan-400 scale-110' : 'text-white hover:text-cyan-300'
          }`}
        >
          <span className="text-xl">{icon}</span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
