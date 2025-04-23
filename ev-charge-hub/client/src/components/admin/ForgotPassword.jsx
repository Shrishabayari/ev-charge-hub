import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("http://localhost:5000/api/admin/forgot-password", { email });
      setMessage(response.data.message); // Display success message
    } catch (err) {
      setError(err.response ? err.response.data.message : "Something went wrong");
    }
  };

  return (
    <div className="container mx-auto mt-16 p-4">
      <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>

      {message && <div className="bg-green-500 text-white p-2 mb-4 text-center">{message}</div>}
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

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
