import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });

      localStorage.setItem("adminToken", response.data.token);
      alert("Login successful!");
      navigate("/admin/dashboard");

    } catch (err) {
      setError(err.response ? err.response.data.message : "Something went wrong");
    }
  };

  return (
    <div className="container mx-auto mt-16 p-4">
      <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

      {error && <div className="bg-red-500 text-white p-2 mb-4 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-md">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold">Email</label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold">Password</label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <input type="checkbox" id="rememberMe" className="mr-2" />
            <label htmlFor="rememberMe" className="text-sm">Remember Me</label>
          </div>
          <a href="/admin/forgot-password" className="text-sm text-blue-500">Forgot Password?</a>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">Login</button>

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?
            <a href="/admin/register" className="text-blue-500"> Register here</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;