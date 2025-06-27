import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from "../common/navbars/AdminNavbar";
import Footer from "../common/Footer";
import { Edit, Trash2, MapPin, Phone, Clock, Zap, Users, Plus } from 'lucide-react';

const ViewBunks = () => {
  const navigate = useNavigate();
  const [bunks, setBunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBunks();
  }, []);

  const fetchBunks = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      const response = await api.get('/api/admin/ev-bunks', {
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
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in to delete.');
        return;
      }
      await api.delete(`/api/admin/ev-bunks/${bunkId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBunks((prevBunks) => prevBunks.filter((bunk) => bunk._id !== bunkId));
    } catch (err) {
      console.error('Error deleting bunk:', err);
      setError('Failed to delete EV Bunk. ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  EV Charging Stations
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                  Manage and monitor your electric vehicle charging infrastructure
                </p>
              </div>
              <button 
                onClick={() => navigate('/admin/add-bunk')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
              >
                <Plus size={20} className="mr-2" />
                Add New Station
              </button>
            </div>
            
            {/* Stats Bar */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Stations</p>
                    <p className="text-2xl font-bold text-gray-900">{bunks.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Available Slots</p>
                    <p className="text-2xl font-bold text-gray-900">{bunks.reduce((sum, bunk) => sum + (bunk.slotsAvailable || 0), 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="mt-6 text-xl text-gray-600 font-medium">Loading EV Charging Stations...</p>
              <p className="mt-2 text-sm text-gray-500">Please wait while we fetch the latest data</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-red-800">Error Loading Stations</h3>
                  <p className="mt-1 text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : bunks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Charging Stations Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Get started by adding your first EV charging station to the network
              </p>
              <button 
                onClick={() => navigate('/admin/add-bunk')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200"
              >
                <Plus size={20} className="mr-2" />
                Add Your First Station
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {bunks.map((bunk) => (
                <div key={bunk._id} className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl border border-white/20 overflow-hidden transition-all duration-300 hover:-translate-y-1">
                  {/* Card Header */}
                <div class="bg-gradient-to-r from-gray-700 to-blue-800 p-6 text-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{bunk.name}</h3>
                        <div className="flex items-center ">
                          <Users size={16} className="mr-1" />
                          <span className="text-sm font-medium">{bunk.slotsAvailable || 0} slots available</span>
                        </div>
                      </div>
                      <div className="p-2 rounded-lg">
                        <Zap className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Address</p>
                        <p className="text-sm text-gray-600">{bunk.address || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Contact</p>
                        <p className="text-sm text-gray-600">{bunk.phone || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Operating Hours</p>
                        <p className="text-sm text-gray-600">{bunk.operatingHours || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Connector Types:</span>
                        <span className="font-medium text-gray-900">{bunk.connectorTypes || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-mono text-xs text-gray-600">{bunk.latitude}, {bunk.longitude}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-gray-50/80 backdrop-blur-sm px-6 py-4 flex space-x-3 border-t border-gray-100/50">
                    <button
                      onClick={() => handleEdit(bunk._id)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bunk._id)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewBunks;