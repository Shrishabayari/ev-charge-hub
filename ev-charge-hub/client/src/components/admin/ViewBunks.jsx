import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from "../common/navbars/AdminNavbar";

const ViewBunks = () => {
  const navigate = useNavigate();
  const [bunks, setBunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBunks();
  }, []);

  const fetchBunks = async () => {
    try {
      const response = await axios.get('/api/admin/ev-bunks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBunks(response.data);
    } catch (err) {
      setError('Error fetching bunks: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bunkId) => {
    navigate(`/admin/edit-bunk/${bunkId}`);
  };

  const handleDelete = async (bunkId) => {
    if (!window.confirm('Are you sure you want to delete this bunk?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/ev-bunks/${bunkId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBunks((prevBunks) => prevBunks.filter((bunk) => bunk._id !== bunkId)); // Update UI
    } catch (err) {
      setError('Error deleting bunk: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading EV Bunks...</div>;
  }

  return (
    <div>
      <AdminNavbar/>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-8">All EV Bunks</h2>

        {/* Error Message */}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Bunks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bunks.map((bunk) => (
            <div key={bunk._id} className="p-6 bg-white border rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-bold mb-2">{bunk.name}</h3>
              <p><strong>Address:</strong> {bunk.address}</p>
              <p><strong>Phone:</strong> {bunk.phone}</p>
              <p><strong>Slots:</strong> {bunk.slotsAvailable}</p>
              <p><strong>Hours:</strong> {bunk.operatingHours || 'N/A'}</p>
              <p><strong>Connectors:</strong> {bunk.connectorTypes || 'N/A'}</p>
              <p><strong>Location:</strong> {bunk.latitude}, {bunk.longitude}</p>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleEdit(bunk._id)}
                  className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(bunk._id)}
                  className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewBunks;