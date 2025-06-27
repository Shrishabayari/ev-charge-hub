import { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import Navbar from "../common/navbars/Navbar";
import Footer from "../common/Footer";

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    await api.post('/api/users/register', formData);      navigate('/user/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100  transition-colors duration-300">
      <Navbar />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-lg bg-white  shadow-2xl rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-center text-gray-800  mb-8">
            Create your account
          </h2>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700  mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full px-4 py-2 border border-gray-300  rounded-lg bg-white  text-gray-800  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700  mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300  rounded-lg bg-white  text-gray-800  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700  mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300  rounded-lg bg-white  text-gray-800  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-600 ">
            Already have an account?{' '}
            <a
              href="/user/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login
            </a>
          </p>
        </div>
      </div><Footer/>
    </div>
  );
}
