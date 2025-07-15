// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import Shop from './pages/public/Shop';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import RepairStatus from './pages/user/RepairStatus';
import NewRepairRequest from './pages/user/NewRepairRequest';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin'; // Admin Login page
import ManageUsers from './pages/admin/ManageUsers';
import ManageProducts from './pages/admin/ManageProducts';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import RepairJobs from './pages/employee/RepairJobs';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <Router>
        <Routes>
          {/* 🌐 Public Pages */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/shop" element={<Layout><Shop /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />

          {/* 👤 User Pages */}
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

          {/* 🛠 Admin Pages */}
          <Route path="/admin" element={<AdminLogin />} /> {/* Always show Admin Login */}
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

          {/* 👨‍🔧 Employee Pages */}
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
