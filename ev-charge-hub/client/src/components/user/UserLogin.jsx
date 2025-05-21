import { useState } from 'react';
import { loginUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/user/dashboard'); // redirect after login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Login</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" onChange={handleChange} placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500" required />
          <input type="password" name="password" onChange={handleChange} placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500" required />
          <button type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition">
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
          Don't have an account? <a href="/user/register" className="text-blue-600 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
}