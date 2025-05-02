import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditEvBunk = () => {
  const { id } = useParams(); // Getting the Bunk ID from the URL
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken'); // Assuming token stored here

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

  useEffect(() => {
    const fetchBunkDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/ev-bunks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData(response.data);
      } catch (err) {
        console.error('Error fetching bunk details:', err);
        setError('Failed to load bunk details.');
      }
    };

    if (token && id) {
      fetchBunkDetails();
    }
  }, [token, id]);

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
      await axios.put(
        `http://localhost:5000/api/admin/ev-bunks/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('EV Bunk updated successfully!');
      setTimeout(() => {
        navigate('/admin/view-bunks'); // After update, navigate back to bunk list
      }, 1000);
    } catch (err) {
      console.error('Error updating bunk:', err);
      setError('Failed to update EV Bunk.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Edit EV Bunk</h2>

      {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
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
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
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
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
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
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
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
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
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
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
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
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 mt-6"
        >
          Update EV Bunk
        </button>
      </form>
    </div>
  );
};

export default EditEvBunk;
