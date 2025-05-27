import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import AdminNavbar from "../common/navbars/AdminNavbar";

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
        setError(null);
        
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

        console.log(`Fetching booking details for ID: ${id}`);

        // Fetch booking details using the correct endpoint
        const response = await axios.get(`/api/bookings/${id}`, { headers });
        
        console.log("API Response:", response.data);
        
        // Handle different API response structures
        let bookingData;
        if (response.data.success && response.data.data) {
          bookingData = response.data.data;
        } else if (response.data.booking) {
          bookingData = response.data.booking;
        } else if (response.data.data) {
          bookingData = response.data.data;
        } else {
          bookingData = response.data;
        }
        
        console.log("Processed booking data:", bookingData);
        setBooking(bookingData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        
        let errorMessage = 'Failed to fetch booking details';
        
        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = 'Authentication failed. Please log in again.';
          } else if (err.response.status === 404) {
            errorMessage = 'Booking not found.';
          } else if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (id) {
      fetchBookingDetail();
    } else {
      setError('No booking ID provided');
      setLoading(false);
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
      
      console.log(`Updating booking ${id} status to ${newStatus}`);
      
      // Update booking status using the correct endpoint
      const response = await axios.patch(
        `/api/bookings/${id}/status`, 
        { status: newStatus },
        { headers }
      );

      console.log('Status update response:', response.data);

      if (response.data.success || response.status === 200) {
        // Update the booking state
        setBooking(prev => ({
          ...prev,
          status: newStatus
        }));
        
        alert(`Booking status updated to ${newStatus} successfully!`);
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      
      let errorMessage = 'Failed to update booking status';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      alert(errorMessage);
    }
  };

  // Format date with error handling
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'PPP p'); // More readable format: "Jan 1, 2024 at 2:30 PM"
    } catch (err) {
      console.error("Date formatting error:", err);
      return 'Invalid date';
    }
  };

  // Status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calculate duration if start and end times are available
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 'N/A';
      }
      
      const durationMs = end - start;
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else if (minutes > 0) {
        return `${minutes}m`;
      } else {
        return 'Less than 1 minute';
      }
    } catch (err) {
      console.error('Duration calculation error:', err);
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Error Loading Booking</h3>
              <div className="mt-2 text-sm">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <div className="flex space-x-3">
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md text-sm"
                  >
                    Retry
                  </button>
                  <button 
                    onClick={() => navigate('/admin/booking/list')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md text-sm"
                  >
                    Back to List
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No booking data found.</p>
          <button 
            onClick={() => navigate('/admin/booking/list')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar/>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
            <p className="text-gray-600 mt-1">View and manage booking information</p>
          </div>
          <button
            onClick={() => navigate('/admin/booking/list')}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Bookings
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          {/* Header section with ID and status */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Booking #{booking._id || 'Unknown'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Created on {formatDate(booking.createdAt)}
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <span
                  className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full border ${getStatusBadgeClass(booking.status)}`}
                >
                  {booking.status || 'Unknown'}
                </span>
                <div>
                  <label htmlFor="status-select" className="sr-only">Update booking status</label>
                  <select
                    id="status-select"
                    value={booking.status || ''}
                    onChange={(e) => updateStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          <div className="p-8">
            {/* User information */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-6 text-gray-900 border-b border-gray-200 pb-3">
                👤 User Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Full Name</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {booking.userId?.name || booking.user?.name || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Email Address</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {booking.userId?.email || booking.user?.email || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {booking.userId?.phone || booking.user?.phone || booking.phoneNumber || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">User ID</p>
                  <p className="font-semibold text-gray-900 mt-1 font-mono text-sm">
                    {booking.userId?._id || booking.user?._id || booking.userId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Charging Station Information */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-6 text-gray-900 border-b border-gray-200 pb-3">
                🔌 Charging Station Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Station Name</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {booking.bunkId?.name || booking.bunk?.name || 'N/A'}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Location</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {booking.bunkId?.address || booking.bunk?.address || booking.bunkId?.location || booking.bunk?.location || 'N/A'}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Operating Hours</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {booking.bunkId?.operatingHours || booking.bunk?.operatingHours || 'N/A'}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Station ID</p>
                  <p className="font-semibold text-gray-900 mt-1 font-mono text-sm">
                    {booking.bunkId?._id || booking.bunk?._id || booking.bunkId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Booking & Slot Details */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-6 text-gray-900 border-b border-gray-200 pb-3">
                📅 Booking & Slot Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Start Time</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {booking.startTime ? formatDate(booking.startTime) : 
                    (booking.slot?.startTime ? formatDate(booking.slot.startTime) : 'N/A')}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">End Time</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {booking.endTime ? formatDate(booking.endTime) : 
                    (booking.slot?.endTime ? formatDate(booking.slot.endTime) : 'N/A')}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Duration</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {booking.duration || calculateDuration(booking.startTime, booking.endTime)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Slot ID</p>
                  <p className="font-semibold text-gray-900 mt-1 font-mono text-sm">
                    {booking.slotId || booking.slot?._id || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            {(booking.vehicle || booking.vehicleId || booking.vehicleModel || booking.vehicleNumber) && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold mb-6 text-gray-900 border-b border-gray-200 pb-3">
                  🚗 Vehicle Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(booking.vehicleModel || booking.vehicle?.model) && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Vehicle Model</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {booking.vehicleModel || booking.vehicle?.model}
                      </p>
                    </div>
                  )}
                  {(booking.vehicleNumber || booking.vehicle?.number) && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Vehicle Number</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {booking.vehicleNumber || booking.vehicle?.number}
                      </p>
                    </div>
                  )}
                  {(booking.vehicleType || booking.vehicle?.type) && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Vehicle Type</p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {booking.vehicleType || booking.vehicle?.type}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payment Information */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-6 text-gray-900 border-b border-gray-200 pb-3">
                💳 Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600 font-medium">Amount</p>
                  <p className="font-semibold text-gray-900 mt-1 text-lg">
                    {booking.amount || booking.payment?.amount ? 
                    `₹${booking.amount || booking.payment?.amount}` : 
                    'N/A'}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600 font-medium">Payment Status</p>
                  <div className="mt-1">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      (booking.paymentStatus === 'paid' || booking.payment?.status === 'paid') ? 
                      'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.paymentStatus || booking.payment?.status || 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600 font-medium">Payment Method</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {booking.paymentMethod || booking.payment?.method || 'N/A'}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600 font-medium">Transaction ID</p>
                  <p className="font-semibold text-gray-900 mt-1 font-mono text-sm">
                    {booking.transactionId || booking.payment?.transactionId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes/Comments */}
            {(booking.notes || booking.comments) && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold mb-6 text-gray-900 border-b border-gray-200 pb-3">
                  📝 Notes & Comments
                </h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {booking.notes || booking.comments || 'No notes available.'}
                  </p>
                </div>
              </div>
            )}

            {/* System Information */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-6 text-gray-900 border-b border-gray-200 pb-3">
                ⚙️ System Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Created At</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {formatDate(booking.createdAt)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Last Updated</p>
                  <p className="font-semibold text-gray-900 mt-1">
                    {formatDate(booking.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-4 mt-12 pt-6 border-t border-gray-200">
              <button
                onClick={() => window.print()}
                className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Details
              </button>
              <button
                onClick={() => navigate('/admin/booking/list')}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetail;