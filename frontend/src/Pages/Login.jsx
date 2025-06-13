import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const { loginUser, error} = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser(formData)
    if(success){
        navigate('/');
      alert("Login Success");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6 border border-gray-200">
        {/* Brand */}
        <h2 className="text-4xl font-extrabold text-center">
          <span className="text-orange-600">Make</span>
          <span className="text-cyan-500">ATrip</span>
        </h2>
        

        {/* Subtitle */}
        <p className="text-center text-gray-500 font-medium">Sign in to continue your journey</p>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm text-center bg-red-100 rounded py-1">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 transition"
          >
            Login
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <a href="/signup" className="text-cyan-600 hover:underline font-medium">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;