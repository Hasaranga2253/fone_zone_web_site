import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'employee') {
      navigate('/');
    } else {
      setEmployee(user);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/'; // Force refresh to clear state everywhere
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white px-6 py-12 flex flex-col items-center font-sans">
      {/* 🔧 Header Card */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: "url('/images/fallback.jpg')" }}
      />
      <div className="w-full max-w-3xl rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-10 py-8 text-center shadow-lg mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2  gradient-text fade-in">Employee Dashboard</h1>

        {employee ? (
          <>
            <p className="text-lg text-white/90 mb-1">
              Welcome, <span className="font-semibold text-cyan-400">{employee.username}</span>
            </p>
            <p className="text-sm uppercase tracking-wide text-gray-400">
              Role: <span className="text-white font-medium">{employee.role}</span>
            </p>
            {employee.category && (
              <p className="text-sm text-emerald-300 mt-1">
                Category: <span className="font-medium">{employee.category}</span>
              </p>
            )}

            {/* Buttons Row */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-md transition-all"
              >
                Logout
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-full shadow-md transition-all"
              >
                Go to Home
              </button>
            </div>
          </>
        ) : (
          <p className="text-yellow-300 mt-4">
            No employee data found. <a href="/login" className="underline">Login</a>
          </p>
        )}
      </div>

      {/* 🌐 Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* 🛠 Repairs Card */}
        {employee?.category?.toLowerCase() === 'repair technician' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all">
            <h2 className="text-xl font-semibold text-cyan-400 mb-2">🛠 Assigned Repairs</h2>
            <p className="text-sm text-gray-300 mb-4">View and update your assigned repair jobs.</p>
            <a
              href="/employee/repairs"
              className="inline-block px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow transition"
            >
              Go to Repairs
            </a>
          </div>
        )}

        {/* 🚚 Delivery Driver Card */}
        {employee?.category?.toLowerCase() === 'delivery driver' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all">
            <h2 className="text-xl font-semibold text-cyan-400 mb-2">🚚 Delivery Jobs</h2>
            <p className="text-sm text-gray-300 mb-4">View and update your assigned deliveries.</p>
            <a
              href="/employee/delivery"
              className="inline-block px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow transition"
            >
              Manage Deliveries
            </a>
          </div>
        )}

        {/* 💬 Sales Support Card */}
        {employee?.category?.toLowerCase() === 'sales support' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all">
            <h2 className="text-xl font-semibold text-cyan-400 mb-2">💬 Support Chat</h2>
            <p className="text-sm text-gray-300 mb-4">Communicate with customers or admin.</p>
            <a
              href="/employee/support"
              className="inline-block px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow transition"
            >
              Open Chat
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
