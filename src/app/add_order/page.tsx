"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../context/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

interface FormData {
  email: string;
  product: string;
  quantity: string;
  creditCard: string;
}

const AddOrder = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    product: '',
    quantity: '',
    creditCard: '',
  });
  const [bulkCount, setBulkCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBulkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBulkCount(Number(e.target.value));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error state

    if (!user) {
      setError('User is not authenticated');
      return;
    }

    const payload = {
      ...formData,
      username: user.username,
      userPassword: user.password,
    };

    try {
      const response = await axios.post('/api/add_order', payload); // Ensure the URL is correct
      if (response.status === 200) {
        alert('Order added successfully!');
        router.push('/customer'); // Navigate to the customer page
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error adding order:', err);
      setError((err as any).response?.data?.message || (err as any).message || 'An unknown error occurred');
    }
  };

  const handleBulkSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error state

    if (!user) {
      setError('User is not authenticated');
      return;
    }

    try {
      const response = await axios.post('/api/add_bulk_orders', {
        count: bulkCount,
        username: user.username,
        userPassword: user.password,
      });
      if (response.status === 200) {
        alert('Bulk orders added successfully!');
        router.push('/customer'); // Navigate to the customer page
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error adding bulk orders:', err);
      setError((err as any).response?.data?.message || (err as any).message || 'An unknown error occurred');
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-md">
          <h1 className="text-2xl font-bold text-center">Add Order</h1>
          <span className="block text-center text-gray-600">Logged in as: {user?.username}</span>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700">Customer Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Product:</label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Credit Card:</label>
              <input
                type="text"
                name="creditCard"
                value={formData.creditCard}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add Order
            </button>
          </form>
          <form onSubmit={handleBulkSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700">Number of Orders to Add:</label>
              <input
                type="number"
                value={bulkCount}
                onChange={handleBulkChange}
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Add Bulk Orders
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AddOrder;
