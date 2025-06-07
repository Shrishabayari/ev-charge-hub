import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
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
        return 'bg-green-100 text-green-800 ring-green-600/20';
      case 'cancelled':
        return 'bg-red-100 text-red-800 ring-red-600/20';
      case 'completed':
        return 'bg-blue-100 text-blue-800 ring-blue-600/20';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20'; // Added pending status
      default:
        return 'bg-gray-100 text-gray-800 ring-gray-600/20';
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminNavbar/>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-3">Booking Management</h1>

        {/* Filter and Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-5">Filter Bookings</h2>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Status filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out appearance-none"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Start date filter */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              />
            </div>

            {/* End date filter */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
              />
            </div>

            {/* Search input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="search"
                  name="search"
                  placeholder="Search by user, bunk, ID..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-r-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-lg text-gray-600 font-medium">Loading bookings, please wait...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-6 py-5 rounded-md mb-8 flex flex-col items-center">
            <p className="text-lg font-semibold mb-3">{error}</p>
            {!getAuthToken() && (
              <button
                onClick={() => navigate('/admin/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
              >
                Go to Login
              </button>
            )}
          </div>
        )}

        {/* Bookings Table */}
        {!loading && !error && (
          <>
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Booking ID
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        EV Bunk
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Slot Time
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-gray-500">
                          <div className="flex flex-col items-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>
                            <p className="mt-3 text-xl font-semibold text-gray-900">No bookings found</p>
                            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search terms to find bookings.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      bookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                            {booking._id?.substring(0, 8) || 'N/A'}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                                <div>
                                    <div className="font-medium text-gray-900">
                                        {safeGet(booking, 'userId.name') || safeGet(booking, 'user.name')}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {safeGet(booking, 'userId.email') || safeGet(booking, 'user.email')}
                                    </div>
                                </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium text-gray-900">
                                {safeGet(booking, 'bunkId.name') || safeGet(booking, 'bunk.name')}
                              </div>
                              <div className="text-gray-500 text-xs">
                                {safeGet(booking, 'bunkId.address') || safeGet(booking, 'bunk.address')}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div><span className="font-semibold">Start:</span> {formatDate(booking.startTime)}</div>
                              <div className="text-xs text-gray-500">
                                <span className="font-semibold">End:</span> {formatDate(booking.endTime)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${getStatusBadgeClass(booking.status)}`}
                            >
                              {booking.status || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-y-2">
                            <div className="flex flex-col items-end space-y-2">
                              <button
                                onClick={() => viewBookingDetails(booking._id)}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition duration-150 ease-in-out"
                              >
                                View Details
                              </button>
                              <select
                                value={booking.status || 'active'}
                                onChange={(e) => updateStatus(booking._id, e.target.value)}
                                className="border border-gray-300 rounded-md p-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                aria-label="Update booking status"
                              >
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
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
            {totalBookings > 0 && (
              <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-xl shadow-lg">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{(currentPage - 1) * limit + 1}</span> to <span className="font-semibold">{Math.min(currentPage * limit, totalBookings)}</span> of <span className="font-semibold">{totalBookings}</span> bookings
                </p>
                <div className="space-x-3">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out font-medium"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm font-semibold text-gray-700 bg-indigo-100 rounded-lg">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out font-medium"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div><Footer/>
    </div>
  );
};

export default AdminBookingsList;