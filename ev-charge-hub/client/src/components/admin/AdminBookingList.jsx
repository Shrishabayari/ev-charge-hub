import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const AdminBookingsList = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [limit] = useState(10);

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  // Function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || 
           localStorage.getItem('token') || 
           localStorage.getItem('userToken') ||
           sessionStorage.getItem('authToken');
  };

  // Function to fetch bookings
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
        return;
      }

      // Construct query params
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', limit.toString());
      
      // Add filters if they exist
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.search) params.append('search', filters.search);

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const apiUrl = `/api/bookings?${params.toString()}`;
      console.log("Fetching bookings with URL:", apiUrl);
      
      const response = await axios.get(apiUrl, { headers });
      
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
        // Optionally redirect to login
        // navigate('/login');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
      }
      
      setLoading(false);
    }
  }, [currentPage, limit, filters]);

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
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Navigate to booking details
  const viewBookingDetails = (bookingId) => {
    navigate(`/admin/bookings/${bookingId}`);
    console.log(`Navigating to booking details for ID: ${bookingId}`);
  };

  // Update booking status
  const updateStatus = async (bookingId, newStatus) => {
    try {
      const token = getAuthToken();
                  
      if (!token) {
        alert('You are not authenticated. Please log in again.');
        return;
      }
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      console.log(`Updating booking ${bookingId} status to ${newStatus}`);
      
      const response = await axios.patch(`/api/bookings/${bookingId}/status`, 
        { status: newStatus },
        { headers }
      );

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
      } else {
        alert(response.data.message || 'Failed to update booking status');
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  // Helper function to safely get nested properties
  const safeGet = (obj, path, defaultValue = 'N/A') => {
    return path.split('.').reduce((current, key) => 
      current && current[key] !== undefined ? current[key] : defaultValue, obj
    );
  };
    
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Booking Management</h1>

      {/* Filter and Search Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Status filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Start date filter */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* End date filter */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Search input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="flex">
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Search by user, bunk..."
                value={filters.search}
                onChange={handleFilterChange}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading bookings...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          <p>{error}</p>
          {!getAuthToken() && (
            <div className="mt-2">
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bookings Table */}
      {!loading && !error && (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                      EV Bunk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slot Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">
                        <div className="flex flex-col items-center">
                          <p className="text-lg mb-2">No bookings found</p>
                          <p className="text-sm">Try adjusting your filters or search terms</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking._id?.substring(0, 8) || 'N/A'}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {safeGet(booking, 'userId.name') || safeGet(booking, 'user.name')}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {safeGet(booking, 'userId.email') || safeGet(booking, 'user.email')}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {safeGet(booking, 'bunkId.name') || safeGet(booking, 'bunk.name')}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {safeGet(booking, 'bunkId.address') || safeGet(booking, 'bunk.address')}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>Start: {formatDate(booking.startTime)}</div>
                            <div className="text-xs text-gray-500">
                              End: {formatDate(booking.endTime)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}
                          >
                            {booking.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-y-2">
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => viewBookingDetails(booking._id)}
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              View Details
                            </button>
                            <select
                              value={booking.status || 'active'}
                              onChange={(e) => updateStatus(booking._id, e.target.value)}
                              className="border border-gray-300 rounded-md p-1 text-xs"
                              aria-label="Update booking status"
                            >
                              <option value="active">Active</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Showing {bookings.length} of {totalBookings} bookings (Page {currentPage} of {totalPages})
            </p>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="px-2 text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBookingsList;