import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(storedCart.length);

    const currentUser = JSON.parse(localStorage.getItem('user'));
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="fade-in bg-blue-600 text-white p-4 flex flex-wrap justify-between items-center shadow-lg bg-glow rounded-b-xl">
      <h1 className="font-bold text-2xl tracking-wide gradient-text drop-shadow-md">📱 FoneZone</h1>

      <div className="space-x-4 text-sm sm:text-base mt-2 sm:mt-0">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/shop" className="nav-link">Shop</Link>
        <Link to="/cart" className="nav-link">
          Cart <span className="bg-white text-blue-600 font-bold px-2 py-0.5 rounded-full text-xs ml-1">{cartCount}</span>
        </Link>

        {!user ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <>
            {user.role === 'employee' && (
              <Link to="/employee/repairs" className="nav-link">Manage Repairs</Link>
            )}

            <span className="ml-2 font-medium text-yellow-200">
              👤 {user.email} <span className="text-xs uppercase">({user.role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full border-glow"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
