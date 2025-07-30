import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [admin, setAdmin] = useState(null);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [overview, setOverview] = useState({
    totalProducts: 0,
    totalUsers: 0,
  });

  // Calendar States
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [salesData, setSalesData] = useState({});

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
      navigate('/admin');
      return;
    }

    const adminData = JSON.parse(localStorage.getItem('admin')) || {};
    setAdmin(adminData);

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    setOverview({
      totalProducts: products.length,
      totalUsers: users.length,
    });

    // Mock sales data (replace with API/MySQL later)
    const mockData = {
      '2025-07-01': { total: 4500, orders: 12 },
      '2025-07-05': { total: 1200, orders: 4 },
      '2025-07-10': { total: 15500, orders: 30 },
    };
    setSalesData(mockData);
  }, [navigate]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('admin');
    localStorage.removeItem('adminLoggedIn');
    setShowConfirmLogout(false);
    navigate('/home');
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getTileColor = (date) => {
    const key = date.toISOString().split('T')[0];
    if (salesData[key]) {
      const total = salesData[key].total;
      if (total > 10000) return 'bg-green-500/70 text-white rounded-lg';
      if (total > 3000) return 'bg-blue-500/70 text-white rounded-lg';
      return 'bg-red-500/70 text-white rounded-lg';
    }
    return '';
  };

  const selectedKey = selectedDate.toISOString().split('T')[0];
  const dayData = salesData[selectedKey] || null;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white flex flex-col items-center justify-start py-10">
      {/* Background Effects */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: "url('/images/fallback.jpg')" }}
      />
      <div className="absolute top-10 left-10 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl animate-pulse z-0" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-1000 z-0" />

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl w-full">
        <div className="glass-card-gradient w-full p-8 rounded-xl shadow-lg backdrop-blur-md bg-white/5 border border-white/10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 gradient-text fade-in">
            Hello! {admin?.username || 'Admin'}
          </h1>
          <p className="text-lg mt-2 gradient-text">Welcome To Admin Dashboard</p>
        </div>
      </div>

      {/* Overview Stats */}
<section className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 max-w-4xl w-full px-6 justify-items-center">
  {[
    { label: 'Products', count: overview.totalProducts, icon: '📦', border: 'border-cyan-400/30' },
    { label: 'Users', count: overview.totalUsers, icon: '👥', border: 'border-pink-400/30' },
  ].map((card, idx) => (
    <div
      key={idx}
      className={`glass-card-gradient p-6 rounded-xl text-center backdrop-blur-md bg-white/5 border ${card.border} shadow-lg hover:shadow-cyan-400/40 hover:scale-105 transition`}
    >
      <h3 className="text-xl font-bold flex justify-center items-center gap-2">
        <span className="text-2xl">{card.icon}</span> {card.label}
      </h3>
      <p className="text-4xl font-extrabold mt-2 gradient-text">{card.count}</p>
    </div>
  ))}
</section>


      {/* Sales Calendar Section */}
      <section className="relative z-10 w-full max-w-5xl bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-md mt-10">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">📅 Sales Overview Calendar</h2>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileClassName={({ date }) => getTileColor(date)}
          className="bg-white rounded-lg p-3 shadow-lg text-black"
        />
        <div className="mt-4 text-gray-200 text-center">
          {dayData ? (
            <p>
              <span className="text-cyan-400 font-bold">{selectedDate.toDateString()}</span> – 
              Sales: <span className="text-green-400">${dayData.total}</span> | Orders: 
              <span className="text-blue-400"> {dayData.orders}</span>
            </p>
          ) : (
            <p>No sales data for this date.</p>
          )}
        </div>
      </section>

      {/* Management Links */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-4xl w-full px-6">
        <div className="glass-card-gradient p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:scale-105 hover:shadow-lg transition text-center">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">📦 Manage Products</h2>
          <p className="text-sm text-gray-300 mb-4">Add, edit, or remove products.</p>
          <a href="/admin/products" className="text-cyan-300 hover:underline font-semibold">
            Go to Product Management
          </a>
        </div>
        <div className="glass-card-gradient p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:scale-105 hover:shadow-lg transition text-center">
          <h2 className="text-xl font-semibold text-pink-400 mb-2">👥 Manage Users</h2>
          <p className="text-sm text-gray-300 mb-4">View and manage registered users.</p>
          <a href="/admin/users" className="text-pink-300 hover:underline font-semibold">
            Go to User Management
          </a>
        </div>
      </section>

      {/* Buttons */}
      <div className="text-center mt-10 relative z-10 flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => setShowConfirmLogout(true)}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
        <button
          onClick={() => navigate('/home')}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Home
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-cyan-400 max-w-sm w-full text-center text-white">
            <h2 className="text-xl font-bold mb-3">Confirm Logout</h2>
            <p className="text-sm mb-5">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
