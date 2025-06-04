import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, Eye, Calendar, MapPin, Phone, Mail, User, Clock, 
  CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw, 
  Filter, UserCheck, Activity 
} from 'lucide-react';
import AdminNavbar from "../common/navbars/AdminNavbar";

const AdminUserManagement = () => {
  // User management state
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Authentication helper
  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      throw new Error('Authentication token not found. Please log in as admin.');
    }
    return token;
  }, []);

  // API call helper with better error handling
  const makeApiCall = useCallback(async (url, options = {}) => {
    try {
      const token = getAuthToken();
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  }, [getAuthToken]);

  // Fetch users with enhanced error handling
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await makeApiCall('/api/admin/users');
      
      // Validate and sanitize user data
      const validatedUsers = data.map(user => ({
        _id: user._id || '',
        name: user.name || 'Unknown User',
        email: user.email || 'No email provided',
        status: user.status || 'inactive',
        createdAt: user.createdAt || new Date().toISOString(),
        totalBookings: Number(user.totalBookings) || 0,
        phone: user.phone || null,
        vehicleType: user.vehicleType || null,
        lastLogin: user.lastLogin || null,
        isActive: user.isActive !== false // Default to true if not specified
      }));
      
      setUsers(validatedUsers);
    } catch (error) {
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [makeApiCall]);

  // Fetch user bookings with better error handling
  const fetchUserBookings = useCallback(async (userId) => {
    if (!userId) {
      setBookingError('Invalid user ID provided');
      return;
    }

    try {
      setBookingsLoading(true);
      setBookingError(null);
      
      const data = await makeApiCall(`/api/admin/users/${userId}/bookings`);
      
      // Validate and sanitize booking data
      const validatedBookings = data.map(booking => ({
        _id: booking._id || '',
        status: booking.status || 'unknown',
        startTime: booking.startTime || null,
        endTime: booking.endTime || null,
        createdAt: booking.createdAt || new Date().toISOString(),
        slotNumber: booking.slotNumber || null,
        amount: booking.amount || 0,
        bunkId: {
          name: booking.bunkId?.name || 'Unknown Station',
          address: booking.bunkId?.address || 'Address not available',
          _id: booking.bunkId?._id || null
        }
      }));
      
      setUserBookings(validatedBookings);
    } catch (error) {
      setBookingError(error.message);
      setUserBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  }, [makeApiCall]);

  // Enhanced filtering and sorting
  const processedUsers = useMemo(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phone && user.phone.includes(searchTerm))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status.toLowerCase() === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle different data types
      if (sortBy === 'createdAt' || sortBy === 'lastLogin') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      } else if (sortBy === 'totalBookings') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [users, searchTerm, statusFilter, sortBy, sortOrder]);

  // Pagination logic
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return processedUsers.slice(startIndex, startIndex + usersPerPage);
  }, [processedUsers, currentPage, usersPerPage]);

  const totalPages = Math.ceil(processedUsers.length / usersPerPage);

  // Effect hooks
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter]);

  // Utility functions
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  }, []);

  const getStatusColor = useCallback((status) => {
    const statusLower = status?.toLowerCase() || '';
    const statusColors = {
      active: 'text-blue-700 bg-blue-100 border-blue-200',
      completed: 'text-green-700 bg-green-100 border-green-200',
      cancelled: 'text-red-700 bg-red-100 border-red-200',
      pending: 'text-yellow-700 bg-yellow-100 border-yellow-200',
      inactive: 'text-gray-700 bg-gray-100 border-gray-200'
    };
    return statusColors[statusLower] || statusColors.inactive;
  }, []);

  const getStatusIcon = useCallback((status) => {
    const statusLower = status?.toLowerCase() || '';
    const statusIcons = {
      active: <CheckCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      inactive: <AlertCircle className="w-4 h-4" />
    };
    return statusIcons[statusLower] || statusIcons.inactive;
  }, []);

  // Event handlers
  const handleMoreInfo = useCallback((user) => {
    setSelectedUser(user);
    fetchUserBookings(user._id);
  }, [fetchUserBookings]);

  const closeModal = useCallback(() => {
    setSelectedUser(null);
    setUserBookings([]);
    setBookingError(null);
  }, []);

  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  }, [sortBy, sortOrder]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin h-16 w-16 text-blue-600 mb-4" />
          <p className="text-xl font-semibold text-gray-700 lg:text-2xl">Loading Users...</p>
          <p className="text-gray-500 mt-2 lg:text-lg">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6 animate-pulse" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3 lg:text-3xl">Error Loading Users</h3>
          <p className="text-red-700 mb-6 text-lg lg:text-xl">{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-md transform hover:scale-105 lg:text-lg flex items-center justify-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-10">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 lg:text-5xl">User Management</h1>
            <p className="text-xl text-gray-600 lg:text-2xl">
              Oversee and manage all registered users and their activities.
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <UserCheck className="w-4 h-4 mr-1" />
                Total Users: {users.length}
              </span>
              <span className="flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                Active Users: {users.filter(u => u.status === 'active').length}
              </span>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or phone..."
                  className="w-full pl-12 pr-6 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-lg bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchUsers}
                className="px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-sm"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        User
                        {sortBy === 'name' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        Email
                        {sortBy === 'email' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center">
                        Join Date
                        {sortBy === 'createdAt' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('totalBookings')}
                    >
                      <div className="flex items-center">
                        Total Bookings
                        {sortBy === 'totalBookings' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortBy === 'status' && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center text-blue-800 font-bold text-lg shadow-sm">
                                {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-6 w-6 text-blue-600" />}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-lg font-medium text-gray-900">
                                {user.name}
                              </div>
                              {user.phone && (
                                <div className="text-sm text-gray-500">
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base text-gray-800">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base text-gray-800">
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-base text-gray-800 font-semibold">{user.totalBookings}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(user.status)}`}>
                            {getStatusIcon(user.status)}
                            <span className="ml-2 capitalize">{user.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                          <button
                            onClick={() => handleMoreInfo(user)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-gray-500 text-xl">
                        {searchTerm || statusFilter !== 'all' ? 'No users match your filters.' : 'No users found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span>
                      {' '}to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * usersPerPage, processedUsers.length)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{processedUsers.length}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal for User Details */}
          {selectedUser && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    User Details - {selectedUser.name}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
                  >
                    <XCircle className="w-7 h-7" />
                  </button>
                </div>

                {/* User Information */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
                      <h4 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" /> Personal Information
                      </h4>
                      <div className="space-y-3 text-gray-700">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-3 text-gray-500" />
                          <span>Name: <span className="font-medium">{selectedUser.name}</span></span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-3 text-gray-500" />
                          <span>Email: <span className="font-medium">{selectedUser.email}</span></span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                          <span>Joined: <span className="font-medium">{formatDate(selectedUser.createdAt)}</span></span>
                        </div>
                        {selectedUser.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-3 text-gray-500" />
                            <span>Phone: <span className="font-medium">{selectedUser.phone}</span></span>
                          </div>
                        )}
                        {selectedUser.lastLogin && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-3 text-gray-500" />
                            <span>Last Login: <span className="font-medium">{formatDate(selectedUser.lastLogin)}</span></span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
                      <h4 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-green-600" /> Activity Summary
                      </h4>
                      <div className="space-y-3 text-gray-700">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                          <span>Total Bookings: <span className="font-medium">{selectedUser.totalBookings}</span></span>
                        </div>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedUser.status)}`}>
                            {getStatusIcon(selectedUser.status)}
                            <span className="ml-2 capitalize">{selectedUser.status}</span>
                          </span>
                        </div>
                        {selectedUser.vehicleType && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Vehicle Type: <span className="font-medium">{selectedUser.vehicleType}</span></span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {selectedUser.isActive ? 'Account Active' : 'Account Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking History Section */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-2xl font-bold text-gray-900 border-b pb-4 border-gray-200">Booking History</h4>
                    {selectedUser && (
                      <button
                        onClick={() => fetchUserBookings(selectedUser._id)}
                        className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </button>
                    )}
                  </div>

                  {bookingsLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
                      <p className="ml-3 text-xl text-gray-600">Loading bookings...</p>
                    </div>
                  ) : bookingError ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
                      <AlertCircle className="h-6 w-6 mx-auto mb-3 text-red-500" />
                      <p className="text-lg mb-4">{bookingError}</p>
                      <button
                        onClick={() => fetchUserBookings(selectedUser._id)}
                        className="bg-red-200 px-4 py-2 rounded-md text-base font-medium text-red-800 hover:bg-red-300 transition-colors"
                      >
                        Retry Loading Bookings
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userBookings.length > 0 ? (
                        <>
                          {/* Booking Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-100 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-blue-800">
                                {userBookings.filter(b => b.status === 'completed').length}
                              </div>
                              <div className="text-sm text-blue-600">Completed Bookings</div>
                            </div>
                            <div className="bg-yellow-100 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-yellow-800">
                                {userBookings.filter(b => b.status === 'pending' || b.status === 'active').length}
                              </div>
                              <div className="text-sm text-yellow-600">Active/Pending</div>
                            </div>
                            <div className="bg-red-100 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-red-800">
                                {userBookings.filter(b => b.status === 'cancelled').length}
                              </div>
                              <div className="text-sm text-red-600">Cancelled</div>
                            </div>
                          </div>

                          {/* Booking List */}
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {userBookings
                              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                              .map((booking) => (
                              <div key={booking._id} className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                      <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                                      <h5 className="text-xl font-semibold text-gray-900">
                                        {booking.bunkId?.name || 'Unknown Station'}
                                      </h5>
                                    </div>
                                    <p className="text-base text-gray-600 mb-2 flex items-center">
                                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                      {booking.bunkId?.address || 'Address not available'}
                                    </p>
                                  </div>
                                  <div className="ml-4 flex-shrink-0">
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-base font-semibold border ${getStatusColor(booking.status)}`}>
                                      {getStatusIcon(booking.status)}
                                      <span className="ml-2 capitalize">{booking.status}</span>
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-4 text-base text-gray-700">
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="font-medium">Start:</span>
                                    <span className="ml-1">{formatDate(booking.startTime)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="font-medium">End:</span>
                                    <span className="ml-1">{formatDate(booking.endTime)}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                    <span className="font-medium">Booked:</span>
                                    <span className="ml-1">{formatDate(booking.createdAt)}</span>
                                  </div>
                                  {booking.slotNumber && (
                                    <div className="flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                                      </svg>
                                      <span className="font-medium">Slot:</span>
                                      <span className="ml-1">{booking.slotNumber}</span>
                                    </div>
                                  )}
                                  {booking.amount > 0 && (
                                    <div className="flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                                      </svg>
                                      <span className="font-medium">Amount:</span>
                                      <span className="ml-1">₹{booking.amount}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Booking duration calculation */}
                                {booking.startTime && booking.endTime && (
                                  <div className="mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Clock className="w-4 h-4 mr-2" />
                                      <span>Duration: </span>
                                      <span className="ml-1 font-medium">
                                        {(() => {
                                          const start = new Date(booking.startTime);
                                          const end = new Date(booking.endTime);
                                          const diff = Math.abs(end - start);
                                          const hours = Math.floor(diff / (1000 * 60 * 60));
                                          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                          return `${hours}h ${minutes}m`;
                                        })()}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-lg">
                          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          No bookings found for this user.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 font-semibold transition-colors duration-200 shadow-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;