import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from "../common/navbars/AdminNavbar"; // Assuming this is your AdminNavbar component

const ViewBunks = () => {
  const navigate = useNavigate();
  const [bunks, setBunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBunks();
  }, []);

  const fetchBunks = async () => {
    setLoading(true); // Ensure loading state is true when fetching
    setError(''); // Clear previous errors
    try {
      const token = localStorage.getItem('adminToken'); // Using 'adminToken' as specified previously
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/admin/ev-bunks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBunks(response.data);
    } catch (err) {
      console.error('Error fetching bunks:', err);
      setError('Failed to fetch EV Bunks. ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bunkId) => {
    navigate(`/admin/edit-bunk/${bunkId}`);
  };

  const handleDelete = async (bunkId) => {
    if (!window.confirm('Are you sure you want to delete this EV bunk? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Authentication token not found. Please log in to delete.');
        return;
      }
      await axios.delete(`/api/admin/ev-bunks/${bunkId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBunks((prevBunks) => prevBunks.filter((bunk) => bunk._id !== bunkId)); // Update UI
      // Optionally, add a success message here
      // setMessage('EV Bunk deleted successfully!');
    } catch (err) {
      console.error('Error deleting bunk:', err);
      setError('Failed to delete EV Bunk. ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <AdminNavbar /> {/* Renders the admin navigation bar */}
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Page Heading - Reverted to previous style */}
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">
            Manage EV Bunks
          </h1>

          {/* Loading, Error, or No Bunks Message */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-6"></div>
              <p className="text-xl text-gray-700">Loading EV Bunks...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative text-center text-lg mb-10" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          ) : bunks.length === 0 ? (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-4 rounded-lg relative text-center text-lg mb-10" role="alert">
              <span className="block sm:inline">No EV Bunks found. Add new bunks to get started!</span>
            </div>
          ) : (
            // Bunks Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {bunks.map((bunk) => (
                <div key={bunk._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  <div className="p-7">
                    {/* Individual Bunk Heading - Now with separation */}
                    <h3 className="text-2xl font-bold text-gray-900 pb-3 mb-4 border-b-2 border-indigo-200">
                      {bunk.name}
                    </h3>
                    <div className="space-y-2 text-gray-700 text-base">
                      <p><strong className="font-semibold text-gray-800">Address:</strong> {bunk.address || 'N/A'}</p>
                      <p><strong className="font-semibold text-gray-800">Phone:</strong> {bunk.phone || 'N/A'}</p>
                      <p><strong className="font-semibold text-gray-800">Slots Available:</strong> <span className="font-bold text-indigo-600">{bunk.slotsAvailable}</span></p>
                      <p><strong className="font-semibold text-gray-800">Operating Hours:</strong> {bunk.operatingHours || 'N/A'}</p>
                      <p><strong className="font-semibold text-gray-800">Connector Types:</strong> {bunk.connectorTypes || 'N/A'}</p>
                      <p><strong className="font-semibold text-gray-800">Location:</strong> {bunk.latitude}, {bunk.longitude}</p>
                    </div>
                  </div>
                  {/* Action Buttons - Now occupying full width within grid cell space */}
                  <div className="bg-gray-50 px-7 py-2 flex gap-3 border-t border-gray-100"> {/* Removed justify-end, added flex-grow to buttons */}
                    <button
                      onClick={() => handleEdit(bunk._id)}
                      className="flex-grow inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bunk._id)}
                      className="flex-grow inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewBunks;