import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { format } from 'date-fns';
import AdminNavbar from "../common/navbars/AdminNavbar";
import Footer from "../common/Footer";
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Zap, 
  Phone, 
  Mail, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit
} from 'lucide-react';

const AdminBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        setLoading(true);
        setError('');

        const token = getAuthToken();

        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`
        };

        console.log(`Fetching booking details for ID: ${id}`);

        // Use the correct admin endpoint for getting booking details
        const response = await api.get(`/api/bookings/${id}`, { headers });
        console.log("API Response:", response.data);

        // Handle different response structures
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

      } catch (err) {
        console.error('Error fetching booking details:', err);

        let errorMessage = 'Failed to fetch booking details. ';

        if (err.response) {
          if (err.response.status === 401) {
            errorMessage = 'Session expired. Please log in again.';
          } else if (err.response.status === 403) {
            errorMessage = 'Access denied. Admin privileges required.';
          } else if (err.response.status === 404) {
            errorMessage = 'Booking not found. Please check the booking ID.';
          } else if (err.response.data?.message) {
            errorMessage += err.response.data.message;
          } else {
            errorMessage += err.message;
          }
        } else {
          errorMessage += err.message;
        }

        setError(errorMessage);
      } finally {
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

  const updateBookingStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const token = getAuthToken();

      if (!token) {
        alert('Authentication token not found. Please log in.');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      console.log(`Updating booking ${id} status to ${newStatus}`);

      // Use the correct admin endpoint for status update
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
      } else {
        alert('Failed to update booking status');
      }
    } catch (err) {
      console.error('Error updating booking status:', err);

      let errorMessage = 'Failed to update booking status. ';
      if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else if (err.response?.status === 404) {
        errorMessage = 'Booking not found or endpoint not available';
      } else {
        errorMessage += err.message;
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

  const formatDateShort = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'MMM dd, yyyy');
    } catch (err) {
      console.error("Date formatting error:", err);
      return 'Invalid date';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'confirmed':
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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
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

  // Helper function to safely get nested properties
  const safeGet = (obj, path, defaultValue = 'N/A') => {
    return path.split('.').reduce((current, key) =>
      current && current[key] !== undefined ? current[key] : defaultValue, obj
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            <div className="mt-4 space-x-4">
              <button
                onClick={() => navigate('/admin/bookings')}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Back to Bookings
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Data</h3>
            <p className="text-yellow-700">No booking data found.</p>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
            >
              Back to Bookings
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/bookings')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Booking Details
              </h1>
              <p className="text-gray-600">
                Booking ID: #{booking._id?.slice(-8) || 'N/A'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {getStatusIcon(booking.status)}
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getStatusBadgeClass(booking.status)}`}>
                {booking.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                User Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                  <p className="text-gray-900">{safeGet(booking, 'userId.name') || safeGet(booking, 'user.name')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{safeGet(booking, 'userId.email') || safeGet(booking, 'user.email')}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{safeGet(booking, 'userId.phone') || safeGet(booking, 'user.phone')}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                  <p className="text-gray-900 font-mono text-sm">
                    {safeGet(booking, 'userId._id') || safeGet(booking, 'user._id') || booking.userId}
                  </p>
                </div>
              </div>
            </div>

            {/* EV Bunk Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                EV Charging Station
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Station Name</label>
                  <p className="text-gray-900">{safeGet(booking, 'bunkId.name') || safeGet(booking, 'bunk.name')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{safeGet(booking, 'bunkId.location') || safeGet(booking, 'bunk.location')}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                  <p className="text-gray-900">{safeGet(booking, 'bunkId.address') || safeGet(booking, 'bunk.address')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Charging Rate</label>
                  <p className="text-gray-900">
                    ₹{safeGet(booking, 'bunkId.pricePerHour') || safeGet(booking, 'bunk.pricePerHour')}/hour
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Booking Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Booking Date</label>
                  <p className="text-gray-900">{formatDateShort(booking.bookingDate || booking.date)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Time Slot</label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-gray-900">{booking.timeSlot || booking.slot || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Duration</label>
                  <p className="text-gray-900">
                    {booking.duration || calculateDuration(booking.startTime, booking.endTime)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                  <p className="text-gray-900">{formatDate(booking.createdAt)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Updated At</label>
                  <p className="text-gray-900">{formatDate(booking.updatedAt)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Vehicle Type</label>
                  <p className="text-gray-900">{booking.vehicleType || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {(booking.totalAmount || booking.amount || booking.price) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Total Amount</label>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{booking.totalAmount || booking.amount || booking.price}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Payment Status</label>
                    <p className="text-gray-900">{booking.paymentStatus || 'Pending'}</p>
                  </div>
                  
                  {booking.paymentMethod && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Payment Method</label>
                      <p className="text-gray-900">{booking.paymentMethod}</p>
                    </div>
                  )}
                  
                  {booking.transactionId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Transaction ID</label>
                      <p className="text-gray-900 font-mono text-sm">{booking.transactionId}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Edit className="h-5 w-5 mr-2" />
                Manage Status
              </h3>
              
              <div className="space-y-3">
                {['pending', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateBookingStatus(status)}
                    disabled={updating || booking.status === status}
                    className={`w-full text-left px-4 py-2 rounded-md border transition-colors ${
                      booking.status === status
                        ? 'bg-blue-50 border-blue-200 text-blue-700 cursor-not-allowed'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="capitalize">{status}</span>
                      {booking.status === status && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {updating && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Updating...
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/bookings')}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Back to All Bookings
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-mono">#{booking._id?.slice(-8) || 'N/A'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="capitalize font-semibold">{booking.status || 'Unknown'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{formatDateShort(booking.bookingDate || booking.date)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span>{booking.timeSlot || booking.slot || 'N/A'}</span>
                </div>
                
                {(booking.totalAmount || booking.amount || booking.price) && (
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600 font-semibold">Total:</span>
                    <span className="font-bold text-green-600">
                      ₹{booking.totalAmount || booking.amount || booking.price}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminBookingDetail;