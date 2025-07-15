import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [overview, setOverview] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
  });

  // 🚨 Check admin auth on load
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
      navigate('/admin'); // Redirect if not logged in
      return;
    }

    const adminData = JSON.parse(localStorage.getItem('admin')) || {};
    setAdmin(adminData);

    // Simulate fetching dashboard data
    setOverview({
      totalProducts: 150,
      totalUsers: 1200,
      totalOrders: 250,
    });
  }, [navigate]);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white overflow-x-hidden">
      {/* 🔷 Faint Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: "url('/images/fallback.jpg')" }}
      />
      <div className="absolute top-10 left-10 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl animate-pulse z-0" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-1000 z-0" />

      {/* 🔹 Admin Card */}
      <div className="relative z-10 flex items-center justify-center p-6 min-h-[30vh]">
        <div className="glass-card-gradient w-full max-w-3xl text-center p-8 rounded-xl shadow-lg backdrop-blur-md bg-white/5 border border-white/10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 gradient-text">Admin Dashboard</h1>
          <p className="text-lg mt-2">
            Welcome, <span className="font-semibold text-indigo-400">{admin?.email}</span>
          </p>
          <p className="text-sm text-gray-400">Role: {admin?.role}</p>
        </div>
      </div>

      {/* 📊 Store Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 relative z-10">
        <div className="bg-indigo-100 text-indigo-700 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">📦 Total Products</h3>
          <p className="text-4xl font-extrabold">{overview.totalProducts}</p>
        </div>
        <div className="bg-pink-100 text-pink-700 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">👥 Total Users</h3>
          <p className="text-4xl font-extrabold">{overview.totalUsers}</p>
        </div>
        <div className="bg-green-100 text-green-700 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold">📊 Total Orders</h3>
          <p className="text-4xl font-extrabold">{overview.totalOrders}</p>
        </div>
      </section>

      {/* ⚙️ Management Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 relative z-10">
        {/* Products */}
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition">
          <h2 className="text-xl font-semibold text-indigo-600 mb-2">📦 Manage Products</h2>
          <p className="text-sm mb-4">Add, edit, or remove mobile phones in your store.</p>
          <a href="/admin/products" className="text-indigo-700 font-bold hover:underline">Go to Product Management</a>
        </div>

        {/* Users */}
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition">
          <h2 className="text-xl font-semibold text-pink-600 mb-2">👥 Manage Users</h2>
          <p className="text-sm mb-4">View and manage registered users.</p>
          <a href="/admin/users" className="text-pink-700 font-bold hover:underline">Go to User Management</a>
        </div>

        {/* Analytics */}
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition">
          <h2 className="text-xl font-semibold text-green-600 mb-2">📈 Store Analytics</h2>
          <p className="text-sm mb-4">View detailed analytics and sales reports.</p>
          <a href="/admin/analytics" className="text-green-700 font-bold hover:underline">View Analytics</a>
        </div>
      </section>

      {/* 🔴 Logout */}
      <div className="text-center mt-10 relative z-10">
        <button
          onClick={() => {
            localStorage.removeItem('admin');
            localStorage.removeItem('adminLoggedIn');
            navigate('/admin');
          }}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
