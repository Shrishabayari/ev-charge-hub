import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const AdminDashboard = () => {
  const history = useHistory();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("adminToken");
    if (!token) {
      // If no token, redirect to login page
      history.push("/");
    }
  }, [history]);

  return (
    <div className="container mx-auto mt-16">
      <h2 className="text-2xl font-semibold mb-6">Welcome to Admin Dashboard</h2>
      {/* Admin Dashboard Content */}
    </div>
  );
};

export default AdminDashboard;
