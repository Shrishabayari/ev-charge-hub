import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { format } from 'date-fns';
import AdminNavbar from "../common/navbars/AdminNavbar";
import Footer from "../common/Footer";

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

        const token = localStorage.getItem('authToken') ||
                      localStorage.getItem('token') ||
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

        // Fixed: Ensure we're using the correct API endpoint
        const response = await api.get(`/api/bookings/${id}`, { headers });
        console.log("API Response:", response.data);

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
            errorMessage = 'Booking not found. Please check the booking ID.';
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
      const token = localStorage.getItem('authToken') ||
                    localStorage.getItem('token') ||
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

      // Fixed: Ensure we're using the correct API endpoint
      const response = await api.patch(
        `/api/bookings/${id}/status`,
        { status: newStatus },
        { headers }
      );

      console.log('Status update response:', response.data);

      if (response.data.success || response.status === 200) {
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
      } else if (err.response?.status === 404) {
        errorMessage = 'Booking not found or endpoint not available';
      }

      alert(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'MMM dd, yyyy - hh:mm a');
    } catch (err) {
      console.error("Date formatting error:", err);
      return 'Invalid date';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
        return 'Less than 1 min';
      }
    } catch (err) {
      console.error('Duration calculation error:', err);
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-5 text-gray-700 text-xl font-medium">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full text-center border border-red-200">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <svg className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Error Loading Booking</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/admin/view-bookings')}
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No Booking Data</h3>
          <p className="text-gray-600 mb-6">It looks like the booking you are looking for does not exist or could not be loaded.</p>
          <button
            onClick={() => navigate('/admin/view-bookings')}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
          >
            Back to Booking List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 md:mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Booking Details</h1>
            <p className="text-gray-600 mt-2 text-lg">Comprehensive view of booking information and management options.</p>
          </div>
          <button
            onClick={() => navigate('/admin/view-bookings')}
            className="mt-6 sm:mt-0 flex items-center px-6 py-3 bg-white text-gray-800 rounded-xl shadow-md hover:bg-gray-100 transition duration-300 ease-in-out transform hover:-translate-y-0.5 border border-gray-200"
          >
            <svg className="w-5 h-5 mr-2 -ml-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0A9 9 0 013 12z" />
            </svg>
            Back to All Bookings
          </button>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
          {/* Header section with ID and status */}
          <div className="border-b border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <svg className="w-7 h-7 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Booking #<span className="ml-1">{booking._id || 'Unknown'}</span>
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Booked on <span className="font-medium text-gray-700">{formatDate(booking.createdAt)}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-5 sm:mt-0">
              <span
                className={`inline-flex items-center px-5 py-2 text-base font-semibold rounded-full border-2 ${getStatusBadgeClass(booking.status)} shadow-sm`}
              >
                {booking.status || 'Unknown'}
              </span>
              <div className="relative">
                <label htmlFor="status-select" className="sr-only">Update booking status</label>
                <select
                  id="status-select"
                  value={booking.status || ''}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="block w-full pl-4 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 appearance-none bg-white font-medium text-gray-700 cursor-pointer"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em" }}
                >
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="p-8 md:p-10">
            {/* User information */}
            <div className="mb-10">
              <h3 className="text-xl font-bold mb-6 text-gray-900 pb-3 flex items-center border-b border-gray-200">
                <svg className="w-6 h-6 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                User Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 font-medium">Full Name</p>
                  <p className="font-semibold text-gray-900 mt-1.5 text-lg">
                    {booking.userId?.name || booking.user?.name || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 font-medium">Email Address</p>
                  <p className="font-semibold text-gray-900 mt-1.5 text-lg">
                    {booking.userId?.email || booking.user?.email || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 col-span-1 sm:col-span-2 lg:col-span-1">
                  <p className="text-sm text-gray-500 font-medium">User ID</p>
                  <p className="font-mono text-sm text-gray-800 mt-1.5 break-all">
                    {booking.userId?._id || booking.user?._id || booking.userId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Charging Station Information */}
            <div className="mb-10">
              <h3 className="text-xl font-bold mb-6 text-gray-900 pb-3 flex items-center border-b border-gray-200">
                <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Charging Station Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-100">
                  <p className="text-sm text-blue-600 font-medium">Station Name</p>
                  <p className="font-semibold text-gray-900 mt-1.5 text-lg">
                    {booking.bunkId?.name || booking.bunk?.name || 'N/A'}
                  </p>
                </div>
                <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-100">
                  <p className="text-sm text-blue-600 font-medium">Location</p>
                  <p className="font-semibold text-gray-900 mt-1.5 text-lg">
                    {booking.bunkId?.address || booking.bunk?.address || booking.bunkId?.location || booking.bunk?.location || 'N/A'}
                  </p>
                </div>
                <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-100">
                  <p className="text-sm text-blue-600 font-medium">Operating Hours</p>
                  <p className="font-semibold text-gray-900 mt-1.5 text-lg">
                    {booking.bunkId?.operatingHours || booking.bunk?.operatingHours || 'N/A'}
                  </p>
                </div>
                <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-100 col-span-1 sm:col-span-2 lg:col-span-1">
                  <p className="text-sm text-blue-600 font-medium">Station ID</p>
                  <p className="font-mono text-sm text-gray-800 mt-1.5 break-all">
                    {booking.bunkId?._id || booking.bunk?._id || booking.bunkId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking & Slot Details */}
            <div className="mb-10">
              <h3 className="text-xl font-bold mb-6 text-gray-900 pb-3 flex items-center border-b border-gray-200">
                <svg className="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Booking & Slot Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-green-50 p-5 rounded-lg shadow-sm border border-green-100">
                  <p className="text-sm text-green-600 font-medium">Start Time</p>
                  <p className="font-semibold text-gray-900 mt-1.5 text-lg">
                    {booking.startTime ? formatDate(booking.startTime) :
                      (booking.slot?.startTime ? formatDate(booking.slot.startTime) : 'N/A')}
                  </p>
                </div>
                <div className="bg-green-50 p-5 rounded-lg shadow-sm border border-green-100">
                  <p className="text-sm text-green-600 font-medium">End Time</p>
                  <p className="font-semibold text-gray-900 mt-1.5 text-lg">
                    {booking.endTime ? formatDate(booking.endTime) :
                      (booking.slot?.endTime ? formatDate(booking.slot.endTime) : 'N/A')}
                  </p>
                </div>
                <div className="bg-green-50 p-5 rounded-lg shadow-sm border border-green-100">
                  <p className="text-sm text-green-600 font-medium">Duration</p>
                  <p className="font-semibold text-gray-900 mt-1.5 text-lg">
                    {booking.duration || calculateDuration(booking.startTime, booking.endTime)}
                  </p>
                </div>
                <div className="bg-green-50 p-5 rounded-lg shadow-sm border border-green-100 col-span-1 sm:col-span-2 lg:col-span-1">
                  <p className="text-sm text-green-600 font-medium">Slot ID</p>
                  <p className="font-mono text-sm text-gray-800 mt-1.5 break-all">
                    {booking.slotId || booking.slot?._id || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            {(booking.vehicle || booking.vehicleId || booking.vehicleModel || booking.vehicleNumber) && (
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-6 text-gray-900 pb-3 flex items-center border-b border-gray-200">
                  <svg className="w-6 h-6 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v-8z" />
                  </svg>
                  Vehicle Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(booking.vehicleModel || booking.vehicle?.model) && (
                    <div className="bg-purple-50 p-5 rounded-lg shadow-sm border border-purple-100">
                      <p className="text-sm text-purple-600 font-medium">Vehicle Model</p>
                      <p className="font-semibold text-gray-900 mt-1.5 text-lg">
                        {booking.vehicleModel || booking.vehicle?.model}
                      </p>
                    </div>
                  )}
                  {(booking.vehicleNumber || booking.vehicle?.number) && (
                    <div className="bg-purple-50 p-5 rounded-lg shadow-sm border border-purple-100">
                      <p className="text-sm text-purple-600 font-medium">Vehicle Number</p>
                      <p className="font-semibold text-gray-900 mt-1.5 text-lg">
                        {booking.vehicleNumber || booking.vehicle?.number}
                      </p>
                    </div>
                  )}
                  {(booking.vehicleType || booking.vehicle?.type) && (
                    <div className="bg-purple-50 p-5 rounded-lg shadow-sm border border-purple-100">
                      <p className="text-sm text-purple-600 font-medium">Vehicle Type</p>
                      <p className="font-semibold text-gray-900 mt-1.5 text-lg">
                        {booking.vehicleType || booking.vehicle?.type}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* System Information */}
            <div className="mb-10">
              <h3 className="text-xl font-bold mb-6 text-gray-900 pb-3 flex items-center border-b border-gray-200">
                <svg className="w-6 h-6 mr-3 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                System Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 font-medium">Created At</p>
                  <p className="font-semibold text-gray-900 mt-1.5 text-lg">
                    {formatDate(booking.createdAt)}
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 font-medium">Last Updated</p>
                  <p className="font-semibold text-gray-900 mt-1.5 text-lg">
                    {formatDate(booking.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-4 mt-12 pt-8 border-t border-gray-200">
              <button
                onClick={() => window.print()}
                className="flex items-center px-6 py-3 bg-white text-gray-800 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 ease-in-out transform hover:-translate-y-0.5 border border-gray-200"
              >
                <svg className="w-5 h-5 mr-2 -ml-1 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Details
              </button>
              <button
                onClick={() => navigate('/admin/view-bookings')}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div><Footer/>
    </div>
  );
};

export default AdminBookingDetail;