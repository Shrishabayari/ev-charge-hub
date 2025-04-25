import React, { useState } from 'react';
import axios from 'axios';

const AddEvBunk = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    slotsAvailable: '',
    latitude: '',
    longitude: '',
    operatingHours: '',
    connectorTypes: '',
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        '/api/admin/ev-bunks/add', // Assuming this is the correct API route
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Token from localStorage
          },
        }
      );
      setMessage(response.data.message);
      setFormData({
        name: '',
        address: '',
        phone: '',
        slotsAvailable: '',
        latitude: '',
        longitude: '',
        operatingHours: '',
        connectorTypes: '',
      });
    } catch (err) {
      setError('Error adding EV Bunk');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Add New EV Bunk</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Bunk Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="slotsAvailable" className="block text-sm font-medium text-gray-700">
              Slots Available
            </label>
            <input
              type="number"
              id="slotsAvailable"
              name="slotsAvailable"
              value={formData.slotsAvailable}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="operatingHours" className="block text-sm font-medium text-gray-700">
              Operating Hours
            </label>
            <input
              type="text"
              id="operatingHours"
              name="operatingHours"
              value={formData.operatingHours}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="connectorTypes" className="block text-sm font-medium text-gray-700">
              Connector Types (comma separated)
            </label>
            <input
              type="text"
              id="connectorTypes"
              name="connectorTypes"
              value={formData.connectorTypes}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4"
          >
            Add EV Bunk
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvBunk;
