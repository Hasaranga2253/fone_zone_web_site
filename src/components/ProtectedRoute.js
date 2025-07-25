import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles = [], allowedCategories = [] }) {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');

  // 🚫 If no one is logged in
  if (!currentUser && !isAdminLoggedIn) {
    return <Navigate to="/login" />;
  }

  // 🔐 Admin route protection
  if (allowedRoles.includes('admin') && !isAdminLoggedIn) {
    return <Navigate to="/admin" />;
  }

  // 🔐 Regular user/employee route protection
  if (currentUser) {
    const { role, category } = currentUser;

    // Check if role is allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" />;
    }

    // If category restrictions apply (only for employees)
    if (role === 'employee' && allowedCategories.length > 0) {
      if (!allowedCategories.includes(category?.toLowerCase())) {
        return <Navigate to="/unauthorized" />;
      }
    }

    return children; // ✅ Access granted
  }

  return <Navigate to="/login" />;
}

export default ProtectedRoute;
