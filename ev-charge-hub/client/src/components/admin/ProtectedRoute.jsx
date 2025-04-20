// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // `null` initially to handle loading

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      axios
        .get("http://localhost:5000/api/protected", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setIsAuthenticated(true))
        .catch(() => setIsAuthenticated(false));
    } else {
      setIsAuthenticated(false); // No token found
    }
  }, []);

  // Render loading or redirection based on authentication status
  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
}

  return (
    <div>
      {/* Protected content goes here */}
      <h1>Welcome to the Admin Dashboard</h1>
      {/* More protected content */}
    </div>
  );
};

export default ProtectedRoute;
