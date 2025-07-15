import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, role }) {
  const currentUser = JSON.parse(localStorage.getItem('user')) || null;
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn');

  if (role === 'admin' && !isAdminLoggedIn) {
    return <Navigate to="/admin" />;
  }

  if ((role === 'user' || role === 'employee') && !currentUser) {
    return <Navigate to="/login" />;
  }

  if (role && currentUser?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
