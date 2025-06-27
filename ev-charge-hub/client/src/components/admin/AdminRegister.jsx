import React, { useState } from "react";
// OLD: import axios from "axios";
import api from "../../api"; // NEW: Import centralized API instance
import { useNavigate } from "react-router-dom";
import Navbar from "../common/navbars/Navbar";
import Footer from "../common/Footer";

const AdminRegister = () => {
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registrationError, setRegistrationError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (adminData.password !== adminData.confirmPassword) {
      setRegistrationError("Passwords do not match");
      return;
    }

    setRegistrationError("");

    try {
      // OLD: const response = await axios.post("http://localhost:5000/api/admin/register", adminData);
      // NEW: Use the centralized API instance and relative path
      const response = await api.post("/api/admin/register", adminData);
      console.log("Registration successful:", response.data);
      alert("Registration successful!");
      navigate("/admin/login");
    } catch (error) {
      console.error("Registration failed:", error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.message) {
        setRegistrationError(error.response.data.message);
      } else {
        setRegistrationError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100  transition-colors duration-300">
      <Navbar />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-white  p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800  mb-6">
            Admin Registration
          </h2>

          {registrationError && (
            <div className="bg-red-500 text-white text-sm text-center py-2 px-4 rounded mb-4">
              {registrationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={adminData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300  rounded-lg bg-white  text-gray-800  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={adminData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300  rounded-lg bg-white  text-gray-800  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={adminData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300  rounded-lg bg-white  text-gray-800  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={adminData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300  rounded-lg bg-white  text-gray-800  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-600  mt-6">
            Already have an account?{" "}
            <a href="/admin/login" className="text-blue-600 hover:underline font-medium">
              Login here
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminRegister;