import React, { useState, useEffect, useCallback } from 'react';
import { apiMethods } from '../../api'; // CORRECTED: Import apiMethods instead of api directly
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

  // Function to get auth token - CORRECTED
  const getAuthToken = () => {
    return localStorage.getItem('adminToken') || localStorage.getItem('token');
  };

  // Function to fetch bookings - CORRECTED
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      console.log("Authentication token:", token ? "Found" : "Not found");

      if (!token) {
        console.warn("No authentication token found in storage");
        setError('You are not authenticated. Please log in again.');
        setLoading(false);
        navigate('/admin/login');
        return;
      }

      // Prepare filters for API call - CORRECTED
      const apiFilters = {
        page: currentPage,
        limit: limit,
        ...filters // Spread all filters
      };

      console.log("Fetching bookings with filters:", apiFilters);

      // CORRECTED: Use the apiMethods instead of direct api call
      const response = await apiMethods.adminGetAllBookings(apiFilters);

      console.log("API response:", response.data);

      // Handle response data
      if (response.data.success) {
        const responseData = response.data.data;

        setBookings(responseData.bookings || []);
        setTotalPages(responseData.pagination?.pages || 1);
        setTotalBookings(responseData.pagination?.total || 0);

        console.log("Successfully loaded bookings:", responseData.bookings?.length || 0);
      } else {
        setError(response.data.message || 'Failed to fetch bookings');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);

      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
        navigate('/admin/login');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch bookings');
      }

      setLoading(false);
    }
  }, [currentPage, limit, filters, navigate]);

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
    fetchBookings();
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Invalid date';
    }
  };

  // Handle status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Navigate to booking details
  const viewBookingDetails = (bookingId) => {
    navigate(`/admin/bookings/${bookingId}`);
    console.log(`Navigating to booking details for ID: ${bookingId}`);
  };

  // Update booking status - CORRECTED
  const updateStatus = async (bookingId, newStatus) => {
    try {
      const token = getAuthToken();

      if (!token) {
        alert('You are not authenticated. Please log in again.');
        navigate('/admin/login');
        return;
      }

      console.log(`Updating booking ${bookingId} status to ${newStatus}`);

      // CORRECTED: Use apiMethods instead of direct api call
      const response = await apiMethods.adminUpdateBookingStatus(bookingId, newStatus);

      if (response.data.success) {
        // Update the booking in the state
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === bookingId
              ? { ...booking, status: newStatus }
              : booking
          )
        );

        console.log('Booking status updated successfully');
        // Show success message
        alert('Booking status updated successfully!');
      } else {
        alert(response.data.message || 'Failed to update booking status');
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/admin/login');
      } else {
        alert(err.response?.data?.message || err.message || 'Failed to update booking status');
      }
    }
  };

  // Helper function to safely get nested properties
  const safeGet = (obj, path, defaultValue = 'N/A') => {
    return path.split('.').reduce((current, key) =>
      current && current[key] !== undefined ? current[key] : defaultValue, obj
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminNavbar/>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Booking Management
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Monitor and manage all EV charging bookings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                <span className="text-sm text-gray-500">Total Bookings</span>
                <div className="text-2xl font-bold text-gray-900">{totalBookings}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter & Search
            </h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status Filter */}
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                />
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Search by user, bunk, ID..."
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Bookings</h3>
              <p className="text-gray-600">Please wait while we fetch the latest data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 mb-8">
            <div className="flex items-center justify-center">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4 text-center sm:text-left">
                <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Bookings</h3>
                <p className="text-red-600 mb-4">{error}</p>
                {!getAuthToken() && (
                  <button
                    onClick={() => navigate('/admin/login')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Go to Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Card Layout */}
        {!loading && !error && (
          <>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    There are no bookings matching your current filters. Try adjusting your search criteria or check back later.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking, index) => (
                  <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">#{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Booking ID: {booking._id?.substring(0, 12) || 'N/A'}...
                            </h3>
                            <p className="text-sm text-gray-500">
                              Created: {formatDate(booking.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadgeClass(booking.status)}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              booking.status?.toLowerCase() === 'active' ? 'bg-emerald-400' :
                              booking.status?.toLowerCase() === 'cancelled' ? 'bg-red-400' :
                              booking.status?.toLowerCase() === 'completed' ? 'bg-blue-400' :'bg-gray-400'
                            }`}></div>
                            {booking.status || 'Unknown'}
                          </span>
                        </div>
                      </div>

                      {/* Card Content Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* User Information */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                {(safeGet(booking, 'userId.name') || safeGet(booking, 'user.name') || 'U').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">Customer Details</h4>
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {safeGet(booking, 'userId.name') || safeGet(booking, 'user.name')}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {safeGet(booking, 'userId.email') || safeGet(booking, 'user.email')}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Station Information */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">EV Station</h4>
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {safeGet(booking, 'bunkId.name') || safeGet(booking, 'bunk.name')}
                              </p>
                              <p className="text-sm text-gray-600 truncate">
                                {safeGet(booking, 'bunkId.address') || safeGet(booking, 'bunk.address')}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Schedule Information */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Schedule Details</h4>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-xs font-medium text-gray-700">Start:</span>
                              <span className="text-sm text-gray-600">{formatDate(booking.startTime)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                              <span className="text-xs font-medium text-gray-700">End:</span>
                              <span className="text-sm text-gray-600">{formatDate(booking.endTime)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => viewBookingDetails(booking._id)}
                            className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            View Details
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">Update Status:</span>
                          <select
                            value={booking.status || 'active'}
                            onChange={(e) => updateStatus(booking._id, e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
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
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            {totalBookings > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-8">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <div className="flex items-center text-sm text-gray-600">
                    <span>Showing</span>
                    <span className="mx-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-medium">
                      {(currentPage - 1) * limit + 1}
                    </span>
                    <span>to</span>
                    <span className="mx-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-medium">
                      {Math.min(currentPage * limit, totalBookings)}
                    </span>
                    <span>of</span>
                    <span className="mx-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md font-medium">
                      {totalBookings}
                    </span>
                    <span>bookings</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-blue-50 rounded-lg">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Next
                      <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminBookingsList;