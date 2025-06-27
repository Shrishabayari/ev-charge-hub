import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // For password visibility icons
import api from "../../api"; // Your API client
import { useNavigate, Link } from 'react-router-dom'; // For navigation and linking
import Navbar from "../common/navbars/Navbar"; // Common Navbar component
import Footer from "../common/Footer"; // Common Footer component

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', // Added name field
    email: '',
    password: ''
    // Removed confirmPassword
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Only one password toggle needed now
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true);

    try {
      // Replace with your actual API registration endpoint
      // Ensure your backend's /api/users/register endpoint expects 'name', 'email', 'password'
      const res = await api.post('/api/users/register', formData); // Sending formData directly

      console.log('Registration successful!', res.data);
      // After successful registration, you might want to redirect to login
      navigate('/user/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
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
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row pt-10 pb-10">
        {/* Left Side - Welcome/Join Text */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
          <div className="max-w-lg">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Join Our<br />Community
            </h1>
            <p className="text-lg text-gray-200 mb-8 leading-relaxed">
              Create your account to unlock full access to our EV charging network features.
              Manage your profile, track bunks locations, and get personalized recommendations.
            </p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex-1 flex items-center px-8 lg:px-16">
          <div className="w-full max-w-md">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white border-opacity-20">
              <div className="items-center mb-2 text-center">
                <h2 className="text-4xl font-bold text-white">
                  Create Account
                </h2>
              </div>
              <div>
                <p className="text-1xl text-gray-100 mb-8 text-center">
                  Already have an account?{' '}
                  <Link to="/user/login" className="text-blue-300 hover:text-blue-200 underline font-medium">
                    Sign In
                  </Link>
                </p>
              </div>

              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              {/* START: Updated Form Section */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name} // Controlled component
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email} // Controlled component
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                    Password
                  </label>
                  <div className="relative"> {/* Added relative for positioning eye icon */}
                    <input
                      type={showPassword ? "text" : "password"} // Conditional type for show/hide
                      name="password"
                      value={formData.password} // Controlled component
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" // Added pr-10 for icon space
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none" // Icon styling
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Registering...</span>
                    </div>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
              {/* END: Updated Form Section */}

              <div className="mt-2 text-center">
                {/* Admin Login Link */}
                <Link
                  to="/admin/login"
                  className="hover:font-bold text-white font-semibold py-3"
                >
                  Admin Login
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
}