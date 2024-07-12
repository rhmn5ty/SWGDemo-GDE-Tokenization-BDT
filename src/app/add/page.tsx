// src/app/add/page.tsx
"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../context/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nik: '',
  });

  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    const payload = {
      ...formData,
      username: user.username,
      userPassword: user.password,
    };

    try {
      const response = await axios.post('/api/add', payload); // Ensure the URL is correct
      if (response.status === 200) {
        alert('Customer added successfully!');
        router.push('/customer'); // Navigate to the customer page
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      setError(error.response?.data?.message || error.message || 'An unknown error occurred');
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold text-center">Add Customer</h1>
          <span className="block text-center text-gray-600">Logged in as: {user?.username}</span>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">NIK:</label>
              <input
                type="text"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add Customer
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AddCustomer;
