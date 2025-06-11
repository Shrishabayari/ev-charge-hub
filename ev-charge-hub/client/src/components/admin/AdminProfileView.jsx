import React, { useEffect, useState } from 'react';
import api from '../../api';
import { User, Mail, Lock, Save, CheckCircle, AlertCircle, Loader2, KeyRound } from 'lucide-react'; // Added KeyRound for admin specific icon
import AdminNavbar from "../common/navbars/AdminNavbar"; // Assuming AdminNavbar exists
import Footer from "../common/Footer";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({ name: '', email: '' });
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch admin profile on mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      setLoading(true);
      setError(''); // Clear previous errors before new fetch
      try {
        const token = localStorage.getItem('adminToken'); // Use adminToken for admin profile

        if (!token) {
          setError('Authentication token not found. Please log in as admin.');
          setLoading(false);
          return;
        }

        // Axios call to fetch admin profile
        const { data } = await api.get('/api/admin/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Corrected: Use setAdmin to update the admin state
        setAdmin(data); 
        setFormData({ name: data.name, password: '' });
      } catch (err) {
        console.error('Error fetching admin profile:', err);
        // Extract specific error message from backend response or provide a fallback
        setError(err.response?.data?.message || 'Failed to load admin profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors before new submission
    setMessage(''); // Clear previous success messages

    try {
      const token = localStorage.getItem('adminToken'); // Use adminToken for admin profile update

      if (!token) {
        setError('Authentication token not found. Please log in as admin.');
        setLoading(false);
        return;
      }

      // Axios call to update admin profile
      const { data } = await api.put('/api/admin/profile',
        { name: formData.name, password: formData.password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAdmin(data); // Update admin state with new data (assuming backend returns updated admin)
      setMessage(data.message || 'Admin profile updated successfully!'); // Use message from backend or default
      setFormData({ ...formData, password: '' }); // Clear password field after successful update
    } catch (err) {
      console.error('Error updating admin profile:', err);
      // Extract specific error message from backend response or provide a fallback
      setError(err.response?.data?.message || 'Admin profile update failed. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminNavbar /> {/* Using AdminNavbar */}
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <KeyRound className="w-6 h-6 text-white" /> {/* Admin specific icon */}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
              <p className="text-gray-600">Manage your administrator account settings and preferences</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <KeyRound className="w-10 h-10 text-white" /> {/* Admin specific icon */}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{admin.name || 'Loading...'}</h3>
                <p className="text-gray-500 text-sm flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {admin.email || 'Loading...'}
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Account Active
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    Admin Privileges
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Update Admin Profile</h2>
                <p className="text-gray-600">Keep your administrator information up to date</p>
              </div>

              {/* Status Messages */}
              {loading && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin mr-3" />
                  <span className="text-blue-800 font-medium">Loading...</span>
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-red-800 font-medium">{error}</span> {/* Display specific error */}
                </div>
              )}
              
              {message && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-green-800 font-medium">{message}</span> {/* Display specific success message */}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}> {/* Added form tag and onSubmit */}
                {/* Email Field (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={admin.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 font-medium focus:outline-none cursor-not-allowed"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:border-gray-300"
                      placeholder="Enter new password (optional)"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Leave blank to keep current password</p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit" // Changed to type="submit" for form submission
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Update Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div><Footer/>
    </div>
  );
};

export default AdminProfile;
