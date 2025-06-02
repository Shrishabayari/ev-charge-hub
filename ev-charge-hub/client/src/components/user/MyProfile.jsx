import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserNavbar from "../common/navbars/UserNavbar";

const MyProfile = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(data);
        setFormData({ name: data.name, password: '' });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        '/api/users/profile',
        { name: formData.name, password: formData.password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(data);
      setMessage('Profile updated successfully');
      setFormData({ ...formData, password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <UserNavbar/>
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white">My Profile</h2>

        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {message && <p className="text-center text-green-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white"
            />
            </div>
            <div>
            <label className="block text-gray-700 dark:text-gray-300">Name</label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-900 dark:text-white"
            />
            </div>
            <div>
            <label className="block text-gray-700 dark:text-gray-300">New Password</label>
            <input
                type="password"
                name="password"
                placeholder="Leave blank to keep current password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-gray-900 dark:text-white"
            />
            </div>
            <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
            Update Profile
            </button>
        </form>
        </div>
    </div>
  );
};

export default MyProfile;
