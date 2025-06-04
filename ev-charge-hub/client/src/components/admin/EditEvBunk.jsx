import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminNavbar from "../common/navbars/AdminNavbar"; // Assuming this is your AdminNavbar component

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
  const [loading, setLoading] = useState(true); // New loading state

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
        setError('Failed to load bunk details. Please try again.');
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };

    if (token && id) {
      fetchBunkDetails();
    } else {
      setLoading(false); // If no token or ID, stop loading
      setError('Authentication token or Bunk ID missing.');
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
    setError(''); // Clear previous errors
    setMessage(''); // Clear previous messages

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
      }, 1500); // Increased timeout for better user experience
    } catch (err) {
      console.error('Error updating bunk:', err);
      setError('Failed to update EV Bunk. Please check your input and try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-gray-700 text-lg">Loading bunk details...</p> {/* Increased text size */}
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar/>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8 bg-white p-10 pt-0 rounded-xl shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-5xl font-extrabold text-gray-900"> {/* Increased from text-4xl to text-5xl */}
              Edit EV Bunk Details
            </h2>
            <p className="mt-2 text-center text-base text-gray-600"> {/* Increased from text-sm to text-base */}
              Update the information for this Electric Vehicle Bunk.
            </p>
          </div>

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center text-base" role="alert"> {/* Increased message text size */}
              <span className="block sm:inline">{message}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center text-base" role="alert"> {/* Increased error text size */}
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bunk Name */}
              <div>
                <label htmlFor="name" className="block text-base font-medium text-gray-700"> {/* Increased from text-sm to text-base */}
                  Bunk Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="off"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base" // Increased input text size
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-base font-medium text-gray-700"> {/* Increased from text-sm to text-base */}
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="off"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base" // Increased input text size
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-base font-medium text-gray-700"> {/* Increased from text-sm to text-base */}
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  autoComplete="off"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base" // Increased input text size
                />
              </div>

              {/* Slots Available */}
              <div>
                <label htmlFor="slotsAvailable" className="block text-base font-medium text-gray-700"> {/* Increased from text-sm to text-base */}
                  Slots Available
                </label>
                <input
                  id="slotsAvailable"
                  name="slotsAvailable"
                  type="number"
                  required
                  value={formData.slotsAvailable}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base" // Increased input text size
                />
              </div>

              {/* Latitude */}
              <div>
                <label htmlFor="latitude" className="block text-base font-medium text-gray-700"> {/* Increased from text-sm to text-base */}
                  Latitude
                </label>
                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any" // Allows decimal numbers
                  required
                  value={formData.latitude}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base" // Increased input text size
                />
              </div>

              {/* Longitude */}
              <div>
                <label htmlFor="longitude" className="block text-base font-medium text-gray-700"> {/* Increased from text-sm to text-base */}
                  Longitude
                </label>
                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any" // Allows decimal numbers
                  required
                  value={formData.longitude}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base" // Increased input text size
                />
              </div>

              {/* Operating Hours */}
              <div>
                <label htmlFor="operatingHours" className="block text-base font-medium text-gray-700"> {/* Increased from text-sm to text-base */}
                  Operating Hours
                </label>
                <input
                  id="operatingHours"
                  name="operatingHours"
                  type="text"
                  autoComplete="off"
                  value={formData.operatingHours}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base" // Increased input text size
                />
              </div>

              {/* Connector Types */}
              <div>
                <label htmlFor="connectorTypes" className="block text-base font-medium text-gray-700"> {/* Increased from text-sm to text-base */}
                  Connector Types (comma separated)
                </label>
                <input
                  id="connectorTypes"
                  name="connectorTypes"
                  type="text"
                  autoComplete="off"
                  value={formData.connectorTypes}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base" // Increased input text size
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out" // Increased button text size
              >
                Update EV Bunk
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvBunk;