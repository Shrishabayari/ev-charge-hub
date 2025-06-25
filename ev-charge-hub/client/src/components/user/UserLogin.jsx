import { useState } from 'react';
import api from "../../api";
import { useNavigate } from 'react-router-dom';
import Navbar from "../common/navbars/Navbar";
import Footer from "../common/Footer";

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);
    try {
      const res = await api.post('/api/users/login', formData);
      
      // --- CRITICAL CHANGE HERE: Use a separate localStorage key for user token ---
      localStorage.setItem('userToken', res.data.token); // Store user token in 'userToken'
      // --- END CRITICAL CHANGE ---

      localStorage.setItem('user', JSON.stringify(res.data.user)); // This is correct for user object
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            Sign in to your account
          </h2>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading} // Disable button when loading
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"          >
              {loading ? "Logging in..." : "Login"} {/* Change button text based on loading */}
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
            Don’t have an account?{' '}
            <a
              href="/user/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </a>
          </p>
        </div>
      </div><Footer/>
    </div>
  );
}
