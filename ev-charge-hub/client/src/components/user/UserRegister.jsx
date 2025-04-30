import { useState } from 'react';
import { registerUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';

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
      await registerUser(formData);
      navigate('/user/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Register</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" onChange={handleChange} placeholder="Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500" required />
          <input type="email" name="email" onChange={handleChange} placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500" required />
          <input type="password" name="password" onChange={handleChange} placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500" required />
          <button type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition">
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
          Already have an account? <a href="/user/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
