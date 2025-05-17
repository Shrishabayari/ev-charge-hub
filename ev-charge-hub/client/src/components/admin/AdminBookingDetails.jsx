import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const AdminBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setLoading(true);
        
        // Get authentication token from storage
        const token = localStorage.getItem('authToken') || 
                      localStorage.getItem('token') || 
                      localStorage.getItem('userToken') ||
                      sessionStorage.getItem('authToken');
        
        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        // Fetch booking details
        const response = await axios.get(`/api/bookings/${id}`, { headers });
        
        // Handle different API response structures
        let bookingData;
        if (response.data.data && response.data.data.booking) {
          bookingData = response.data.data.booking;
        } else if (response.data.booking) {
          bookingData = response.data.booking;
        } else {
          bookingData = response.data;
        }
        
        console.log("Booking data:", bookingData);
        setBooking(bookingData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError(err.response?.data?.message || 'Failed to fetch booking details');
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetail();
    }
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      // Get the token
      const token = localStorage.getItem('authToken') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('userToken') ||
                  sessionStorage.getItem('authToken');
                  
      if (!token) {
        alert('You are not authenticated. Please log in again.');
        return;
      }
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      // Update booking status
      const response = await axios.patch(
        `/api/bookings/${id}/status`, 
        { status: newStatus },
        { headers }
      );

      if (response.data.success || response.status === 200) {
        // Update the booking state
        setBooking(prev => ({
          ...prev,
          status: newStatus
        }));
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  // Format date with error handling
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (err) {
      console.error("Date formatting error:", err);
      return 'Invalid date';
    }
  };

  // Status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Booking Details</h1>
        <button
          onClick={() => navigate('/admin/booking/list')}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Back to Bookings
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading booking details...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          <p>{error}</p>
          <div className="mt-2">
            <button 
              onClick={() => navigate('/login')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {!loading && booking && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header section with ID and status */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Booking #{booking._id}</h2>
                <p className="text-sm text-gray-500">
                  Created on {formatDate(booking.createdAt)}
                </p>
              </div>
              <div className="flex items-center">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}
                >
                  {booking.status}
                </span>
                <div className="ml-4">
                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus(e.target.value)}
                    className="border border-gray-300 rounded-md p-2"
                    aria-label="Update booking status"
                  >
                    <option value="active">Active</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="p-6">
            {/* User information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {booking.userId?.name || booking.user?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">
                    {booking.userId?.email || booking.user?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">
                    {booking.userId?.phone || booking.user?.phone || booking.phoneNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium">
                    {booking.userId?._id || booking.user?._id || booking.userId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicle information if available */}
            {(booking.vehicle || booking.vehicleId || booking.vehicleModel || booking.vehicleNumber) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(booking.vehicleModel || booking.vehicle?.model) && (
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Model</p>
                      <p className="font-medium">
                        {booking.vehicleModel || booking.vehicle?.model}
                      </p>
                    </div>
                  )}
                  {(booking.vehicleNumber || booking.vehicle?.number) && (
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Number</p>
                      <p className="font-medium">
                        {booking.vehicleNumber || booking.vehicle?.number}
                      </p>
                    </div>
                  )}
                  {(booking.vehicleType || booking.vehicle?.type) && (
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Type</p>
                      <p className="font-medium">
                        {booking.vehicleType || booking.vehicle?.type}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Bunk and Charger Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Charging Station Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Station Name</p>
                  <p className="font-medium">
                    {booking.bunkId?.name || booking.bunk?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">
                    {booking.bunkId?.location || booking.bunk?.location || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Charger Type</p>
                  <p className="font-medium">
                    {booking.chargerType || booking.bunkId?.chargerType || booking.bunk?.chargerType || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Station ID</p>
                  <p className="font-medium">
                    {booking.bunkId?._id || booking.bunk?._id || booking.bunkId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Booking & Slot Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Booking & Slot Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p className="font-medium">
                    {booking.startTime ? formatDate(booking.startTime) : 
                     (booking.slot?.startTime ? formatDate(booking.slot.startTime) : 'N/A')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Time</p>
                  <p className="font-medium">
                    {booking.endTime ? formatDate(booking.endTime) : 
                     (booking.slot?.endTime ? formatDate(booking.slot.endTime) : 'N/A')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">
                    {booking.duration || 
                     (booking.startTime && booking.endTime ? 
                      `${Math.round((new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60))} minutes` : 
                      'N/A')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Slot ID</p>
                  <p className="font-medium">
                    {booking.slotId || (booking.slot?._id) || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-medium">
                    {booking.amount || booking.payment?.amount ? 
                     `₹${booking.amount || booking.payment?.amount}` : 
                     'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className="font-medium">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      (booking.paymentStatus === 'paid' || booking.payment?.status === 'paid') ? 
                      'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.paymentStatus || booking.payment?.status || 'Pending'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">
                    {booking.paymentMethod || booking.payment?.method || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-medium">
                    {booking.transactionId || booking.payment?.transactionId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes/Comments */}
            {(booking.notes || booking.comments) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Notes</h3>
                <p className="whitespace-pre-wrap">
                  {booking.notes || booking.comments || 'No notes available.'}
                </p>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end mt-8 space-x-4">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Print
              </button>
              <button
                onClick={() => navigate('/admin/booking/list')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookingDetail;