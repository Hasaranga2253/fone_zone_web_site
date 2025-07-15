// src/pages/admin/AdminDashboard.js
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

  // Check if admin is logged in on page load
  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isAdminLoggedIn) {
      navigate('/admin'); // Redirect to Admin Login page if not logged in
    }
    
    // Fetch admin information
    const adminData = JSON.parse(localStorage.getItem('admin')) || {}; 
    setAdmin(adminData);

    // Simulate fetching store overview (e.g., from API)
    setOverview({
      totalProducts: 150, // Example value, replace with actual data
      totalUsers: 1200, // Example value, replace with actual data
      totalOrders: 250, // Example value, replace with actual data
    });
  }, [navigate]);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-gray-800 to-blue-900 text-white">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-no-repeat bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: "url('/images/fallback.jpg')" }}
      />

      {/* Decorative Overlays */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-5 z-0" />
      <div className="absolute top-10 left-10 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl animate-pulse z-0" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400/10 rounded-full blur-2xl animate-pulse delay-1000 z-0" />

      {/* Foreground Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="glass-card-gradient text-center max-w-3xl w-full p-10 rounded-xl shadow-lg backdrop-blur-md bg-white/5 border border-white/10 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 gradient-text fade-in">
            Admin Dashboard
          </h1>
          <div className="text-center mt-4">
            <p className="text-lg">Welcome, <span className="font-semibold text-indigo-600">{admin?.email}</span></p>
            <p className="text-sm text-gray-500">Role: {admin?.role}</p>
          </div>
        </div>
      </div>

      {/* Overview Stats Section */}
      <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
        {/* Total Products Card */}
        <div className="bg-indigo-100 p-6 rounded-lg shadow-md backdrop-blur-md bg-white/5 border border-white/10">
          <h3 className="text-xl font-semibold text-indigo-600">📦 Total Products</h3>
          <p className="text-3xl font-bold text-indigo-700">{overview.totalProducts}</p>
        </div>

        {/* Total Users Card */}
        <div className="bg-pink-100 p-6 rounded-lg shadow-md backdrop-blur-md bg-white/5 border border-white/10">
          <h3 className="text-xl font-semibold text-pink-600">👥 Total Users</h3>
          <p className="text-3xl font-bold text-pink-700">{overview.totalUsers}</p>
        </div>

        {/* Total Orders Card */}
        <div className="bg-green-100 p-6 rounded-lg shadow-md backdrop-blur-md bg-white/5 border border-white/10">
          <h3 className="text-xl font-semibold text-green-600">📊 Total Orders</h3>
          <p className="text-3xl font-bold text-green-700">{overview.totalOrders}</p>
        </div>
      </section>

      {/* Dashboard Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {/* Product Management Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">📦 Manage Products</h2>
          <p className="text-sm text-gray-700 mb-4">Add, edit, or remove mobile phones in your store.</p>
          <a
            href="/admin/products"
            className="btn-primary text-indigo-600 font-semibold hover:underline"
          >
            Go to Product Management
          </a>
        </div>

        {/* User Management Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold text-pink-600 mb-4">👥 Manage Users</h2>
          <p className="text-sm text-gray-700 mb-4">View and manage registered users.</p>
          <a 
            href="/admin/users" 
            className="btn-secondary text-pink-600 font-semibold hover:underline"
          >
            Go to User Management
          </a>
        </div>

        {/* Additional Cards for Future Features */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold text-green-600 mb-4">📊 Store Analytics</h2>
          <p className="text-sm text-gray-700 mb-4">View detailed analytics and sales reports.</p>
          <a
            href="/admin/analytics"
            className="btn-primary text-green-600 font-semibold hover:underline"
          >
            View Analytics
          </a>
        </div>
      </section>

      {/* Logout Button */}
      <div className="text-center mt-10">
        <button
          onClick={() => {
            localStorage.removeItem('adminLoggedIn'); // Remove admin login status from localStorage
            localStorage.removeItem('admin'); // Optional: Clear admin data from localStorage
            navigate('/admin'); // Redirect to Admin Login page
          }}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
