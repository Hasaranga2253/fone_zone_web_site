import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// 🌐 Public Pages
import Home from './pages/public/Home';
import Shop from './pages/public/Shop';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';

// 👤 User Pages
import UserDashboard from './pages/user/UserDashboard';
import RepairStatus from './pages/user/RepairStatus';
import NewRepairRequest from './pages/user/NewRepairRequest';
import Wishlist from './pages/user/Wishlist';
import ContactSupport from './pages/user/ContactSupport';

// 🛠 Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageProducts from './pages/admin/ManageProducts';

// 👨‍🔧 Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import Repairs from './pages/employee/repairs';
import DeliveryJobs from './pages/employee/delivery';
import SupportChat from './pages/employee/support';

function App() {
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const adminExists = users.some(
      (user) => user.email === 'admin@fonezone.com' && user.role === 'admin'
    );

    if (!adminExists) {
      users.push({
        email: 'admin@fonezone.com',
        password: 'admin123',
        role: 'admin'
      });
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      console.log('✅ Default admin injected');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <Toaster position="top-right" />
      <Router>
        <Routes>

          {/* 🌍 Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/home" element={<Layout><Home /></Layout>} />
          <Route path="/shop" element={<Layout><Shop /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />

          {/* 👤 User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/repair-status"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <RepairStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/repair-request"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <NewRepairRequest />
              </ProtectedRoute>
            }
          />

          {/* 🛠 Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageProducts />
              </ProtectedRoute>
            }
          />

          {/* 👨‍🔧 Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/repairs"
            element={
              <ProtectedRoute
                allowedRoles={['employee']}
                allowedCategories={['repair technician']}
              >
                <Repairs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/delivery"
            element={
              <ProtectedRoute
                allowedRoles={['employee']}
                allowedCategories={['delivery driver']}
              >
                <DeliveryJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/support"
            element={
              <ProtectedRoute
                allowedRoles={['employee']}
                allowedCategories={['sales support']}
              >
                <SupportChat />
              </ProtectedRoute>
            }
          />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/user/ContactSupport" element={<ContactSupport />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
