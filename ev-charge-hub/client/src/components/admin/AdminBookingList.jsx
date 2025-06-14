// client/src/pages/admin/AdminBookingsList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { apiMethods } from '../../api'; // Import apiMethods
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import AdminNavbar from "../common/navbars/AdminNavbar";
import Footer from "../common/Footer";

const AdminBookingsList = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [limit] = useState(10); // Items per page

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  // Helper function to get auth token for client-side checks
  const getAuthToken = useCallback(() => {
    return localStorage.getItem('adminToken') ||
           localStorage.getItem('token') ||
           sessionStorage.getItem('adminToken') ||
           sessionStorage.getItem('token');
  }, []);

  // Function to fetch bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      console.log("Authentication token:", token ? "Found" : "Not found");

      if (!token) {
        console.warn("No authentication token found in storage. Redirecting to admin login.");
        setError('You are not authenticated. Please log in again.');
        navigate('/admin/login'); // Redirect to admin login if no token
        setLoading(false);
        return;
      }

      // Prepare filters for API call
      const apiFilters = { ...filters };
      // Remove empty filters before sending to API
      Object.keys(apiFilters).forEach(key => {
        if (!apiFilters[key]) delete apiFilters[key];
      });

      // Use the dedicated admin method from apiMethods
      console.log(`Fetching admin bookings with page=${currentPage}, limit=${limit}, filters:`, apiFilters);
      const response = await apiMethods.getAllAdminBookings(currentPage, limit, apiFilters);
      console.log("API response:", response.data);

      let responseData;
      // Handle various backend response formats
      if (response.data.success) {
        responseData = response.data.data;
      } else if (response.data.bookings) {
        responseData = response.data;
      } else {
        // Default structure if backend response is just an array or unexpected
        responseData = {
          bookings: Array.isArray(response.data) ? response.data : [],
          pagination: {
            pages: 1,
            total: Array.isArray(response.data) ? response.data.length : 0
          }
        };
      }

      setBookings(responseData.bookings || []);
      setTotalPages(responseData.pagination?.pages || 1);
      setTotalBookings(responseData.pagination?.total || 0);

      console.log("Successfully loaded bookings:", responseData.bookings?.length || 0);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setLoading(false);
      let errorMessage = 'Failed to load bookings. Please try again.';
      if (err.response) {
        // Server responded with an error status
        if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = 'Authentication required or not authorized to view bookings.';
          navigate('/admin/login'); // Redirect to login on auth failure
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // Request was made but no response received (network error)
        errorMessage = 'No response from server. Please check your network connection.';
      }
      setError(errorMessage);
    }
  }, [currentPage, limit, filters, getAuthToken, navigate]);

  // Fetch bookings when component mounts or dependencies change
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  // Handle search input submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings(); // Re-fetch with new filters
  };

  // Format date for display (e.g., "Jan 01, 2023 - 14:30")
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(new Date(dateString), 'MMM dd, yyyy - HH:mm');
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Invalid date';
    }
  };

  // Get Tailwind CSS classes for status badges
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Navigate to booking details page
  const viewBookingDetails = (bookingId) => {
    navigate(`/admin/bookings/${bookingId}`); // Ensure this matches your React Router path for details
    console.log(`Navigating to booking details for ID: ${bookingId}`);
  };

  // Update booking status
  const updateStatus = async (bookingId, newStatus) => {
    try {
      const token = getAuthToken(); // Re-check token before action
      if (!token) {
        alert('You are not authenticated. Please log in again.');
        navigate('/admin/login');
        return;
      }

      console.log(`Updating booking ${bookingId} status to ${newStatus}`);
      // Use the dedicated admin method from apiMethods
      const response = await apiMethods.updateAdminBookingStatus(bookingId, newStatus);

      if (response.data.success || response.status === 200) {
        // Update the booking in the local state to reflect the new status
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === bookingId
              ? { ...booking, status: newStatus }
              : booking
          )
        );
        console.log('Booking status updated successfully');
        alert(`Booking status updated to ${newStatus} successfully!`);
      } else {
        alert(response.data.message || 'Failed to update booking status');
      }
    } catch (err) {
      console.error('Error updating booking status:', err);

      let errorMessage = 'Failed to update booking status';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        navigate('/admin/login');
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to update this booking.';
      }
      alert(errorMessage);
    }
  };

  // Helper function to safely access nested object properties
  const safeGet = (obj, path, defaultValue = 'N/A') => {
    return path.split('.').reduce((current, key) =>
      current && typeof current === 'object' && current[key] !== undefined ? current[key] : defaultValue, obj
    );
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bookings...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Bookings</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchBookings} // Allows retrying the fetch
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
          <p className="text-gray-600">Manage and monitor all EV charging bookings</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search bookings..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="md:col-span-4 flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={() => {
                  setFilters({ status: '', startDate: '', endDate: '', search: '' });
                  setCurrentPage(1);
                  fetchBookings(); // Immediately re-fetch after clearing filters
                }}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Bookings ({totalBookings} total)
            </h2>
          </div>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9V7a1 1 0 011-1h10a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-500">There are no bookings matching your current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bunk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking._id?.slice(-8) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{safeGet(booking, 'user.name')}</div>
                          <div className="text-gray-500">{safeGet(booking, 'user.email')}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{safeGet(booking, 'bunk.name')}</div>
                          <div className="text-gray-500">{safeGet(booking, 'bunk.location')}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{formatDate(booking.startTime)}</div>
                          <div className="text-gray-500">to {formatDate(booking.endTime)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{booking.totalAmount || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewBookingDetails(booking._id)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            View
                          </button>
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(booking._id, 'active')}
                                className="text-green-600 hover:text-green-900 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateStatus(booking._id, 'cancelled')}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status === 'active' && (
                            <button
                              onClick={() => updateStatus(booking._id, 'completed')}
                              className="text-purple-600 hover:text-purple-900 transition-colors"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminBookingsList;
