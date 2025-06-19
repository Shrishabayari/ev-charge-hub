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
  const [updating, setUpdating] = useState(false);

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
      setUpdating(true);
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

      const response = await api.patch(
        `/api/bookings/admin/${id}/status`,
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
    } finally {
      setUpdating(false);
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

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return {
          bg: 'bg-emerald-500',
          text: 'text-white',
          icon: '⚡',
          gradient: 'from-emerald-400 to-emerald-600'
        };
      case 'cancelled':
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          icon: '✕',
          gradient: 'from-red-400 to-red-600'
        };
      case 'completed':
        return {
          bg: 'bg-blue-500',
          text: 'text-white',
          icon: '✓',
          gradient: 'from-blue-400 to-blue-600'
        };
      case 'pending':
        return {
          bg: 'bg-amber-500',
          text: 'text-white',
          icon: '⏳',
          gradient: 'from-amber-400 to-amber-600'
        };
      default:
        return {
          bg: 'bg-gray-500',
          text: 'text-white',
          icon: '?',
          gradient: 'from-gray-400 to-gray-600'
        };
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <AdminNavbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600 mx-auto"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-indigo-400 mx-auto"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">Loading Booking Details</h3>
              <p className="text-gray-600">Please wait while we fetch the information...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <AdminNavbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-red-100">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h3>
                <p className="text-gray-600">{error}</p>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/admin/view-bookings')}
                  className="px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Back to Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <AdminNavbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Booking Found</h3>
                <p className="text-gray-600">The booking you're looking for doesn't exist or couldn't be loaded.</p>
              </div>
              <button
                onClick={() => navigate('/admin/view-bookings')}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Back to Bookings
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <AdminNavbar />
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-600 to-indigo-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold">Booking Details</h1>
              </div>
              <p className="text-blue-100 text-lg max-w-2xl">
                Comprehensive booking information and management dashboard for ID: {booking._id || 'Unknown'}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                  Created: {formatDate(booking.createdAt)}
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
                  Updated: {formatDate(booking.updatedAt)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${statusConfig.gradient} shadow-lg`}>
                <span className="text-lg">{statusConfig.icon}</span>
                <span className="font-semibold text-white">{booking.status || 'Unknown'}</span>
              </div>
              
              <div className="relative">
                <select
                  value={booking.status || ''}
                  onChange={(e) => updateStatus(e.target.value)}
                  disabled={updating}
                  className="appearance-none bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-xl px-4 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300"
                >
                  <option value="active" className="text-gray-900">Active</option>
                  <option value="cancelled" className="text-gray-900">Cancelled</option>
                  <option value="completed" className="text-gray-900">Completed</option>
                  <option value="pending" className="text-gray-900">Pending</option>
                </select>
                <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              <button
                onClick={() => navigate('/admin/view-bookings')}
                className="flex items-center space-x-2 px-6 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl hover:bg-opacity-30 transition-all duration-300 border border-white border-opacity-30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                <span>Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - User & Vehicle Info */}
          <div className="xl:col-span-1 space-y-8">
            
            {/* User Information Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">User Information</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {booking.userId?.name || booking.user?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Email Address</p>
                    <p className="text-lg font-semibold text-gray-900 break-all">
                      {booking.userId?.email || booking.user?.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">User ID</p>
                    <p className="text-sm font-mono text-gray-700 bg-gray-50 p-2 rounded-lg break-all">
                      {booking.userId?._id || booking.user?._id || booking.userId || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Information Card */}
            {(booking.vehicle || booking.vehicleId || booking.vehicleModel || booking.vehicleNumber) && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold">Vehicle Information</h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {(booking.vehicleModel || booking.vehicle?.model) && (
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Vehicle Model</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {booking.vehicleModel || booking.vehicle?.model}
                      </p>
                    </div>
                  )}
                  {(booking.vehicleNumber || booking.vehicle?.number) && (
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Vehicle Number</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {booking.vehicleNumber || booking.vehicle?.number}
                      </p>
                    </div>
                  )}
                  {(booking.vehicleType || booking.vehicle?.type) && (
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Vehicle Type</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {booking.vehicleType || booking.vehicle?.type}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Station & Booking Info */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Charging Station Information Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Charging Station</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Station Name</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {booking.bunkId?.name || booking.bunk?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Operating Hours</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {booking.bunkId?.operatingHours || booking.bunk?.operatingHours || 'N/A'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 font-medium mb-1">Location</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {booking.bunkId?.address || booking.bunk?.address || booking.bunkId?.location || booking.bunk?.location || 'N/A'}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 font-medium mb-1">Station ID</p>
                    <p className="text-sm font-mono text-gray-700 bg-gray-50 p-2 rounded-lg break-all">
                      {booking.bunkId?._id || booking.bunk?._id || booking.bunkId || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Booking Timeline</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
                    <p className="text-sm text-green-600 font-medium mb-1">Start Time</p>
                    <p className="text-lg font-bold text-gray-900">
                      {booking.startTime ? formatDate(booking.startTime) :
                        (booking.slot?.startTime ? formatDate(booking.slot.startTime) : 'N/A')}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-2xl border border-red-100">
                    <p className="text-sm text-red-600 font-medium mb-1">End Time</p>
                    <p className="text-lg font-bold text-gray-900">
                      {booking.endTime ? formatDate(booking.endTime) :
                        (booking.slot?.endTime ? formatDate(booking.slot.endTime) : 'N/A')}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-sm text-blue-600 font-medium mb-1">Duration</p>
                    <p className="text-lg font-bold text-gray-900">
                      {booking.duration || calculateDuration(booking.startTime, booking.endTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-4 mt-12">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 border border-gray-200"
          >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <span>Print Details</span>
          </button>
          
          <button
            onClick={() => navigate('/admin/view-bookings')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span>All Bookings</span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminBookingDetail;