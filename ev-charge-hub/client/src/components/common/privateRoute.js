// src/components/common/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children, requiresAdmin = false }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  // Show loading spinner while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If admin route but user is not admin
  if (requiresAdmin && (!user || user.role !== 'admin')) {
    return <Navigate to="/dashboard" />;
  }

  // If authenticated and (not an admin route OR user is admin)
  return children;
};

export default PrivateRoute;