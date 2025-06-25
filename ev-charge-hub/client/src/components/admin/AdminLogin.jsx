import React, { useState } from "react";
import api from "../../api"; // Import centralized API instance

import { useNavigate } from "react-router-dom";
import Navbar from "../common/navbars/Navbar"; // Assuming Navbar exists
import { Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react'; // Importing Lucide icons
import Footer from "../common/Footer";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // For success messages
  const [loading, setLoading] = useState(false); // For loading state
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

      // --- IMPORTANT DEBUGGING STEP ---
      console.log("Admin Login Response Data:", response.data);
      console.log("Token received from Admin Login:", response.data.token);
      // Ensure 'response.data.token' is the actual JWT string.
      // If it's the user object here, then your backend's admin login response is incorrect.
      // --- END DEBUGGING STEP ---

      localStorage.setItem("token", response.data.token);
      setMessage("Login successful! Redirecting to dashboard..."); // Set success message
      
      // Delay navigation slightly to allow message to be seen
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500); // Redirect after 1.5 seconds

    } catch (err) {
      console.error("Admin login error:", err);
      // More specific error message extraction
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-3xl">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
            Admin Login
          </h2>

          {/* Error Message Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="block sm:inline font-medium text-sm">{error}</span>
            </div>
          )}

          {/* Success Message Display */}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="block sm:inline font-medium text-sm">{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                </>
              )}
            </button>

            {/* Register Link */}
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
              Don't have an account?{" "}
              <a href="/admin/register" className="text-blue-600 hover:underline font-medium">
                Register here
              </a>
            </p>
          </form>
        </div>
      </div><Footer/>
    </div>
  );
};

export default AdminLogin;