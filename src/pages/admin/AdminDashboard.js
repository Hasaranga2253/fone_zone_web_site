import React from 'react';

export default function AdminDashboard() {
  const admin = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen p-6 bg-white text-black rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8">🛠️ Admin Dashboard</h1>

      <div className="text-center mb-6">
        <p className="text-lg">Welcome, <span className="font-semibold">{admin?.email}</span></p>
        <p className="text-sm text-gray-500">Role: {admin?.role}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Management Card */}
        <div className="bg-indigo-100 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold mb-2">📦 Manage Products</h2>
          <p className="text-sm mb-4 text-gray-700">Add, edit, or remove mobile phones in your store.</p>
          <a
            href="/admin/products"
            className="text-indigo-700 font-semibold hover:underline"
          >
            Go to Product Management
          </a>
        </div>

        {/* User Management Card */}
        <div className="bg-pink-100 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold mb-2">👥 Manage Users</h2>
          <p className="text-sm mb-4 text-gray-700">View and remove registered users.</p>
          <a 
            href="/admin/users" 
            className="text-pink-700 font-semibold hover:underline"
            >
              Go to User Management
            </a>
        </div>
      </div>

      {/* Logout button */}
      <div className="text-center mt-10">
        <button
          onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
