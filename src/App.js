// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Shop from './pages/public/Shop';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import RepairStatus from './pages/user/RepairStatus';
import NewRepairRequest from './pages/user/NewRepairRequest';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageProducts from './pages/admin/ManageProducts';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import RepairJobs from './pages/employee/RepairJobs';

function App() {
  // ✅ Inject default admin on first load
  useEffect(() => {
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    const adminExists = existingUsers.some(
      user => user.email === 'admin@fonezone.com' && user.role === 'admin'
    );

    if (!adminExists) {
      existingUsers.push({
        email: 'admin@fonezone.com',
        password: 'admin123',
        role: 'admin',
      });
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      console.log('✅ Default admin injected');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <Router>
        <Routes>
          {/* 🌐 Public Pages (wrapped in Layout) */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/shop" element={<Layout><Shop /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />

          {/* 🔐 Auth Pages (no Layout for simplicity) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 👤 User Dashboard & Repair Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/repairs"
            element={
              <ProtectedRoute role="user">
                <RepairStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/repair/new"
            element={
              <ProtectedRoute role="user">
                <NewRepairRequest />
              </ProtectedRoute>
            }
          />

          {/* 🛠 Admin Management Pages */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute role="admin">
                <ManageProducts />
              </ProtectedRoute>
            }
          />

          {/* 🧑‍🔧 Employee Tools */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute role="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/repairs"
            element={
              <ProtectedRoute role="employee">
                <RepairJobs />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
