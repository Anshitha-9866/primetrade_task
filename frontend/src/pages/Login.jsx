import React, { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaTasks } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:to-blue-900 transition-colors">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gradient-to-tr dark:from-gray-900 dark:to-blue-900 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-2">
          {/* Icon and Colorful "Task Manager" Heading */}
          <FaTasks className="text-5xl mb-3 text-pink-500 drop-shadow-lg" aria-label="Task Manager" />
          <h1 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text drop-shadow-lg">
            Task Manager
          </h1>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Login</h2>
        {error && <p className="text-red-500 text-center font-bold">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-bold text-blue-600 dark:text-blue-300 block mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full p-2 border border-purple-300 rounded-xl focus:ring-2 focus:ring-blue-200 dark:bg-gray-800 dark:text-white transition"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-purple-600 dark:text-purple-300 block mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="w-full p-2 border border-pink-300 rounded-xl focus:ring-2 focus:ring-purple-200 dark:bg-gray-800 dark:text-white transition"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 rounded-xl font-semibold text-white shadow-lg transition transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <Link to="/signup" className="text-pink-500 hover:underline font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
