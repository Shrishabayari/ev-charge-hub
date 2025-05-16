import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const AdminBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/bookings/${id}`);
        
        if (response.data.success) {
          setBooking(response.data.data);
        } else {
          setError('Failed to fetch booking details');
        }
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError(err.response?.data?.message || 'An error occurred while fetching booking details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [id]);
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy HH:mm:ss');
    } catch (err) {
      return 'Invalid date';
    }
  };
  
  // Update booking status
  const updateStatus = async (newStatus) => {
    try {
      const response = await axios.patch(`/api/admin/bookings/${id}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        // Update the booking in the state
        setBooking({
          ...booking,
          status: newStatus
        });
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };
  
  // Handle status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="ml-2">Loading booking details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/admin/bookings')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Bookings
        </button>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-md">
          <p>Booking not found</p>
        </div>
        <button
          onClick={() => navigate('/admin/bookings')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Bookings
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Booking Details</h1>
        <button
          onClick={() => navigate('/admin/bookings')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Bookings
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Booking #{booking._id}
            </h2>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
              {booking.status}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            {/* Booking Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Booking ID</p>
                  <p className="mt-1 text-sm text-gray-900">{booking._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="mt-1">
                    <select
                      value={booking.status}
                      onChange={(e) => updateStatus(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Time</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(booking.startTime)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">End Time</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(booking.endTime)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(booking.createdAt)}</p>
                </div>
              </div>
            </div>
            
            {/* User Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="mt-1 text-sm text-gray-900">{booking.userId?._id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="mt-1 text-sm text-gray-900">{booking.userId?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{booking.userId?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="mt-1 text-sm text-gray-900">{booking.userId?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            {/* EV Bunk Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">EV Bunk Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Bunk ID</p>
                  <p className="mt-1 text-sm text-gray-900">{booking.bunkId?._id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Bunk Name</p>
                  <p className="mt-1 text-sm text-gray-900">{booking.bunkId?.name || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="mt-1 text-sm text-gray-900">{booking.bunkId?.address || 'N/A'}</p>
                </div>
                {booking.bunkId?.coordinates && (
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Coordinates</p>
                    <p className="mt-1 text-sm text-gray-900">
                      Lat: {booking.bunkId.coordinates.lat || 'N/A'}, 
                      Lng: {booking.bunkId.coordinates.lng || 'N/A'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <div className="space-x-3">
            {booking.status === 'active' && (
              <>
                <button
                  onClick={() => updateStatus('completed')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => updateStatus('cancelled')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel Booking
                </button>
              </>
            )}
            {booking.status === 'cancelled' && (
              <button
                onClick={() => updateStatus('active')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reactivate Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetail;