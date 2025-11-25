import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaTasks } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Sign up failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-yellow-100 to-pink-100 dark:from-gray-900 dark:to-green-900 transition-colors">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gradient-to-tr dark:from-gray-900 dark:to-green-900 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-2">
          {/* Icon and Colorful Heading */}
          <FaTasks className="text-5xl mb-3 text-green-500 drop-shadow-lg" aria-label="Task Manager" />
          <h1 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-green-500 via-yellow-500 to-pink-500 bg-clip-text drop-shadow-lg">
            Task Manager
          </h1>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Create an Account</h2>
        {error && <p className="text-red-500 text-center font-bold">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="text-sm font-bold text-green-600 dark:text-green-300 block mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full p-2 border border-green-300 rounded-xl focus:ring-2 focus:ring-yellow-200 dark:bg-gray-800 dark:text-white transition"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-bold text-yellow-600 dark:text-yellow-300 block mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full p-2 border border-yellow-300 rounded-xl focus:ring-2 focus:ring-pink-200 dark:bg-gray-800 dark:text-white transition"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-pink-600 dark:text-pink-300 block mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="w-full p-2 border border-pink-300 rounded-xl focus:ring-2 focus:ring-green-200 dark:bg-gray-800 dark:text-white transition"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-green-500 via-yellow-500 to-pink-500 hover:from-green-600 hover:via-yellow-600 hover:to-pink-600 rounded-xl font-semibold text-white shadow-lg transition transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-green-500 hover:underline font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

