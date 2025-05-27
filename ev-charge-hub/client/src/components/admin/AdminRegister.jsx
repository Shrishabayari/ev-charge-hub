import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/navbars/Navbar";

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
    setRegistrationError(""); // Clear any previous error

    try {
      const response = await axios.post("http://localhost:5000/api/admin/register", adminData);
      console.log("Registration successful:", response.data);
      alert("Registration successful!");
      navigate("/admin/login");
    } catch (error) {
      console.error("Registration failed:", error.response ? error.response.data : error.message);
      setRegistrationError("Registration failed. Please try again.");
      if (error.response && error.response.data && error.response.data.message) {
        setRegistrationError(error.response.data.message); // Display backend error message if available
      }
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="flex justify-center items-start min-h-screen py-20 bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Register</h2>
        {registrationError && <p className="text-red-500 mb-4">{registrationError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={adminData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={adminData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={adminData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={adminData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Register
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/admin/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
      </div>
    </div>
  );
};

export default AdminRegister;