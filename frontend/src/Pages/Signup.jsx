import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();

  const { signupUser, error, setError, success } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    role: "USER",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { first_name, last_name, email, password, phone } = formData;

    if (!first_name || !last_name || !email || !password || !phone) {
      return setError("All fields are required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Invalid email format.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return setError("Phone number must be 10 digits.");
    }

    setError(""); // Clear error if validation passes

    const success = await signupUser(formData);
    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl border border-gray-200 rounded-xl p-8 space-y-6">
        {/* Title */}
        <h2 className="text-4xl font-extrabold text-center">
          <span className="text-orange-600">Make</span>
          <span className="text-cyan-500">ATrip</span>
        </h2>

        {/* Subtitle */}
        <p className="text-center text-gray-500 font-medium">
          Create your travel account
        </p>

        {/* Error message */}
        {error && (
          <p className="text-red-600 text-sm text-center bg-red-100 rounded py-1">
            {error}
          </p>
        )}
        {success && (
          <p className="text-red-600 text-sm text-center bg-red-100 rounded py-1">
            {success}
          </p>
        )}

        {/* Signup form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          >
            <option value="USER">Traveler</option>
            <option value="VENDOR">Vendor</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-semibold py-2 rounded-md hover:bg-orange-700 transition"
          >
            Register
          </button>
        </form>

        {/* Redirect link */}
        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-cyan-600 hover:underline font-medium"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;