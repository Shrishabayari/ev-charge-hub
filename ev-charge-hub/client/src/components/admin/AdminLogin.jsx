import React, { useState } from "react";
import api from "../../api"; // Import centralized API instance
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
// Importing Lucide icons including Eye and EyeOff
import { Mail, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Navbar from "../common/navbars/Navbar"; // Assuming Navbar exists
import Footer from "../common/Footer";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // For success messages
  const [loading, setLoading] = useState(false); // For loading state
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setMessage(""); // Clear previous messages
    setLoading(true); // Set loading to true

    try {
      const response = await api.post("/api/admin/login", {
        email,
        password,
      });

      console.log("Admin Login Response Data:", response.data);
      console.log("Token received from Admin Login:", response.data.token);

      localStorage.setItem("token", response.data.token);
      // If your admin backend also returns admin user data, store it similarly:
      // localStorage.setItem("admin", JSON.stringify(response.data.admin));
      setMessage("Login successful! Redirecting to dashboard...");

      // Delay navigation slightly to allow message to be seen
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500); // Redirect after 1.5 seconds

    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
        }}
      />

      {/* Navbar - positioned above background */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex pt-0">
        {/* Left Side - Admin Welcome Text */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
          <div className="max-w-lg">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Admin<br />Portal
            </h1>
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              Empower your administrative control over the entire system. Manage bunks, bunk locations, users, and their bookings with precision and ease.
            </p>
          </div>
        </div>

        {/* Right Side - Admin Login Form */}
        <div className="flex-1 flex items-center px-8 lg:px-16">
          <div className="w-full max-w-md">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white border-opacity-20">
              <div className=" items-center mb-2 text-center">
                <h2 className="text-4xl font-bold text-white">
                  Admin Sign in
                </h2>
                </div>
                <div>
                  <p className="text-1xl text-gray-100 mb-8 text-center">
                    Don't have an account?{' '}
                  <Link to="/admin/register" className="text-blue-300 hover:text-blue-200 underline font-medium">
                    Admin Sign Up
                  </Link>
                </p>
                </div>

              {/* Error Message Display */}
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-lg mb-6 flex items-center space-x-3 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="block sm:inline font-medium">{error}</span>
                </div>
              )}

              {/* Success Message Display */}
              {message && (
                <div className="bg-green-500 bg-opacity-20 border border-green-400 text-green-100 px-4 py-3 rounded-lg mb-6 flex items-center space-x-3 text-sm">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="block sm:inline font-medium">{message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-300" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full pl-10 pr-4 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Password Input with Eye Toggle */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-300" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"} // Dynamic type based on showPassword state
                      id="password"
                      name="password"
                      className="w-full pl-10 pr-12 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all" // Increased pr for eye icon
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button" // Important: type="button" to prevent form submission
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors focus:outline-none" // Positioning and styling for the eye icon
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Admin Sign in"
                  )}
                </button>
              </form>

              <div className="mt-2 text-center">
                {/* Admin Login Link - now a true navigation link */}
                <Link
                  to="/user/login" // This is the crucial change
                  className=" hover:font-bold text-white font-semibold py-3 "
                >
                  User Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - positioned at bottom */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
};

export default AdminLogin;