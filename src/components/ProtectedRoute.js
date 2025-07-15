// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, role }) {
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn'); // Check if admin is logged in

  // Protect Admin pages
  if (role === 'admin' && !isAdminLoggedIn) {
    return <Navigate to="/admin" />; // Redirect to admin login if not logged in
  }

  if (role === 'user' && !currentUser) {
    return <Navigate to="/login" />; // Redirect to login if not logged in as user
  }

  if (role === 'employee' && !currentUser) {
    return <Navigate to="/login" />; // Redirect to login if not logged in as employee
  }

  return children; // If authenticated, show the protected page
}

export default ProtectedRoute;
