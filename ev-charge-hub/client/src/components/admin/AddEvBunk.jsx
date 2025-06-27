import React, { useState } from 'react';
import api from '../../api'; // Import your centralized API instance
import AdminNavbar from '../common/navbars/AdminNavbar';
import Footer from "../common/Footer";

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

    if (!formData.name || !formData.address || !formData.phone || !formData.slotsAvailable || !formData.latitude || !formData.longitude) {
      setError('All required fields must be filled!');
      setMessage('');
      return;
    }

    try {
      const response = await api.post(
        '/api/bunks',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage(response.data.message || 'EV Bunk added successfully!');
      setError('');
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
      setMessage('');
      setError('Error adding EV Bunk: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <AdminNavbar />

      <div className="max-w-4xl mx-auto mt-12 px-6 py-10 bg-white  shadow-lg rounded-xl mb-6" >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add New EV Bunk
        </h1>

        {message && (
          <p className="text-green-600 bg-green-100 border border-green-300 rounded p-3 text-center mb-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 bg-red-100 border border-red-300 rounded p-3 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { id: 'name', label: 'Bunk Name', type: 'text', required: true },
            { id: 'address', label: 'Address', type: 'text', required: true },
            { id: 'phone', label: 'Phone Number', type: 'text', required: true },
            { id: 'slotsAvailable', label: 'Slots Available', type: 'number', required: true },
            { id: 'latitude', label: 'Latitude', type: 'number', required: true },
            { id: 'longitude', label: 'Longitude', type: 'number', required: true },
            { id: 'operatingHours', label: 'Operating Hours (e.g., 8AM - 10PM)', type: 'text', required: false },
            { id: 'connectorTypes', label: 'Connector Types (comma separated)', type: 'text', required: false },
          ].map(({ id, label, type, required }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700  mb-1">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={type}
                id={id}
                name={id}
                value={formData[id]}
                onChange={handleChange}
                required={required}
                className="w-full px-4 py-3 border border-gray-300  rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 "
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-300 shadow-md"
            >
              Add EV Bunk
            </button>
          </div>
        </form>
      </div><Footer/>
    </div>
  );
};

export default AddEvBunk;
