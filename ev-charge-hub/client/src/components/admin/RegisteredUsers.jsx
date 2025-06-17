import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search, Eye, User,
  CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw, Trash2,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from 'lucide-react';
import api from '../../api';
import AdminNavbar from "../common/navbars/AdminNavbar";
import Footer from "../common/Footer";

// Reusable Dropdown for actions
const Dropdown = ({ children, className, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300">
        {label} {/* This 'label' prop now holds the user's status */}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10 border border-gray-100 animate-fade-in-down">
          {children(() => setIsOpen(false))}
        </div>
      )}
    </div>
  );
};

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
  const [error, setError] = useState(null); // Corrected: was setError(null)
  const [bookingError, setBookingError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Delete states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // API call helper with proper error handling
  const makeApiCall = useCallback(async (url, options = {}) => {
    try {
      const config = {
        method: options.method || 'GET',
        url,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      if (options.data) {
        config.data = options.data;
      }

      if (options.params) {
        config.params = options.params;
      }

      const response = await api(config);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      console.error(`API call failure for ${url}:`, error);
      throw new Error(errorMessage);
    }
  }, []);

  // Fetch users with enhanced error handling
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await makeApiCall('/api/admin/users');

      let usersArray = [];
      if (Array.isArray(data)) {
        usersArray = data;
      } else if (data.users && Array.isArray(data.users)) {
        usersArray = data.users;
      } else if (data.data && Array.isArray(data.data)) {
        usersArray = data.data;
      }

      const validatedUsers = usersArray.map(user => ({
        _id: user._id || '',
        name: user.name || 'Unknown User',
        email: user.email || 'No email provided',
        status: user.status || 'active',
        createdAt: user.createdAt || new Date().toISOString(),
        totalBookings: Number(user.totalBookings) || 0,
        lastLogin: user.lastLogin || null,
        isActive: user.isActive !== false
      }));

      setUsers(validatedUsers);
    } catch (error) {
      console.error('Fetch users error:', error);
      setError(`Failed to load users: ${error.message}`);
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

      let bookingsArray = [];
      if (Array.isArray(data)) {
        bookingsArray = data;
      } else if (data.bookings && Array.isArray(data.bookings)) {
        bookingsArray = data.bookings;
      } else if (data.data && Array.isArray(data.data)) {
        bookingsArray = data.data;
      }

      const validatedBookings = bookingsArray.map(booking => ({
        _id: booking._id || '',
        status: booking.status || 'unknown',
        startTime: booking.startTime || null,
        endTime: booking.endTime || null,
        createdAt: booking.createdAt || new Date().toISOString(),
        slotNumber: booking.slotNumber || null,
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

  // Update user status
  const updateUserStatus = useCallback(async (userId, status) => {
    try {
      setUpdateLoading(true);

      await makeApiCall(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        data: { status }
      });

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, status } : user
        )
      );

      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(prev => ({ ...prev, status }));
      }
    } catch (error) {
      alert(`Failed to update user status: ${error.message}`);
    } finally {
      setUpdateLoading(false);
    }
  }, [makeApiCall, selectedUser]);

  // Delete user
  const deleteUser = useCallback(async (userId) => {
    try {
      setUpdateLoading(true);

      await makeApiCall(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));

      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null);
      }

      setShowDeleteConfirm(null);
    } catch (error) {
      alert(`Failed to delete user: ${error.message}`);
    } finally {
      setUpdateLoading(false);
    }
  }, [makeApiCall, selectedUser]);

  // Search users
  const searchUsers = useCallback(async (query) => {
    if (!query.trim()) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await makeApiCall('/api/admin/users/search', {
        params: { q: query }
      });

      let usersArray = [];
      if (Array.isArray(data)) {
        usersArray = data;
      } else if (data.users && Array.isArray(data.users)) {
        usersArray = data.users;
      } else if (data.data && Array.isArray(data.data)) {
        usersArray = data.data;
      }

      const validatedUsers = usersArray.map(user => ({
        _id: user._id || '',
        name: user.name || 'Unknown User',
        email: user.email || 'No email provided',
        status: user.status || 'active',
        createdAt: user.createdAt || new Date().toISOString(),
        totalBookings: Number(user.totalBookings) || 0,
        lastLogin: user.lastLogin || null,
        isActive: user.isActive !== false
      }));

      setUsers(validatedUsers);
    } catch (error) {
      setError(error.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [makeApiCall, fetchUsers]);

  // Enhanced filtering and sorting
  const processedUsers = useMemo(() => {
    let filtered = users;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status.toLowerCase() === statusFilter);
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

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
  }, [users, statusFilter, sortBy, sortOrder]);

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
    setCurrentPage(1);
  }, [statusFilter]);

  // Debounced search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers(searchTerm);
      } else {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, searchUsers, fetchUsers]);

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
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'inactive': return 'text-gray-700 bg-gray-100';
      case 'banned': return 'text-red-700 bg-red-100';
      case 'suspended': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  }, []);

  const getStatusIcon = useCallback((status) => {
    switch (status?.toLowerCase()) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'banned': return <XCircle className="w-4 h-4" />;
      case 'suspended': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  }, []);

  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user);
    setUserBookings([]);
    setBookingError(null);
    fetchUserBookings(user._id);
  }, [fetchUserBookings]);

  const handleStatusChange = useCallback((userId, newStatus) => {
    updateUserStatus(userId, newStatus);
  }, [updateUserStatus]);

  const handleDeleteUser = useCallback((userId) => {
    setShowDeleteConfirm(userId);
  }, []);

  const confirmDelete = useCallback(() => {
    if (showDeleteConfirm) {
      deleteUser(showDeleteConfirm);
    }
  }, [showDeleteConfirm, deleteUser]);

  const cancelDelete = useCallback(() => {
    setShowDeleteConfirm(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 font-sans">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
            <User className="w-8 h-8 mr-3 text-blue-600" />
            User Management
          </h1>

          {/* Search, Filter, Sort, and Refresh Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8 items-end">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 appearance-none bg-white bg-no-repeat bg-right-2 bg-center-y pr-8 text-gray-700"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1.5rem', backgroundPositionX: 'calc(100% - 0.75rem)' }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 appearance-none bg-white bg-no-repeat bg-right-2 bg-center-y pr-8 text-gray-700"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '1.5rem', backgroundPositionX: 'calc(100% - 0.75rem)' }}
            >
              <option value="createdAt-desc">Newest Users</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="totalBookings-desc">Most Bookings</option>
              <option value="totalBookings-asc">Least Bookings</option>
            </select>

            <button
              onClick={fetchUsers}
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition duration-200 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center shadow-sm">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20 text-blue-600">
              <Loader2 className="w-10 h-10 animate-spin" />
              <span className="ml-3 text-lg font-medium text-gray-600">Loading users...</span>
            </div>
          ) : (
            <>
              {/* Users Table */}
              <div className="overflow-x-auto rounded-xl shadow-md border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Bookings</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-lg">
                          No users found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-blue-50 transition duration-150 ease-in-out">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                  {user.name ? user.name[0].toUpperCase() : <User className="w-5 h-5" />}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {getStatusIcon(user.status)}
                              <span className="ml-1 capitalize">{user.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 font-semibold">
                            {user.totalBookings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                            <div className="flex items-center space-x-2">
                              {/* View Details Button with label */}
                              <button
                                onClick={() => handleUserSelect(user)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-blue-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                title="View Details"
                              >
                                <Eye className="w-5 h-5" />
                                <span className="text-sm">View Details</span>
                              </button>

                              {/* Actions Dropdown: Label now shows current user status */}
                              <Dropdown
                                label={user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Update Status'}
                              >
                                {(closeDropdown) => (
                                  <>
                                    <button
                                      onClick={() => { handleStatusChange(user._id, 'active'); closeDropdown(); }}
                                      className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors duration-150"
                                      disabled={updateLoading}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Set Active
                                    </button>
                                    <button
                                      onClick={() => { handleStatusChange(user._id, 'inactive'); closeDropdown(); }}
                                      className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors duration-150"
                                      disabled={updateLoading}
                                    >
                                      <XCircle className="w-4 h-4 mr-2 text-gray-500" /> Set Inactive
                                    </button>
                                    <button
                                      onClick={() => { handleStatusChange(user._id, 'suspended'); closeDropdown(); }}
                                      className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors duration-150"
                                      disabled={updateLoading}
                                    >
                                      <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" /> Set Suspended
                                    </button>
                                  </>
                                )}
                              </Dropdown>

                              {/* Delete Button with label */}
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-800 px-3 py-2 rounded-md hover:bg-red-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
                                title="Delete User"
                                disabled={updateLoading}
                              >
                                <Trash2 className="w-5 h-5" />
                                <span className="text-sm">Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 p-4 bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, processedUsers.length)} of {processedUsers.length} results
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      <ChevronsLeft className="w-4 h-4 text-gray-600" />
                    </button>

                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>

                    <span className="px-4 py-2 text-sm text-gray-700 font-medium">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>

                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      <ChevronsRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100 animate-slide-up">
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <User className="w-6 h-6 mr-2 text-blue-600" />
                  User Details
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <XCircle className="w-7 h-7" />
                </button>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
                <div>
                  <h4 className="font-semibold text-lg text-gray-800 mb-3">Personal Information</h4>
                  <div className="space-y-3 text-base text-gray-700">
                    <p><span className="font-medium text-gray-900">Name:</span> {selectedUser.name}</p>
                    <p><span className="font-medium text-gray-900">Email:</span> {selectedUser.email}</p>
                    <p>
                      <span className="font-medium text-gray-900">Account Status:</span>
                      <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg text-gray-800 mb-3">Activity Summary</h4>
                  <div className="space-y-3 text-base text-gray-700">
                    <p><span className="font-medium text-gray-900">Total Bookings:</span> <span className="font-bold text-blue-600">{selectedUser.totalBookings}</span></p>
                    <p><span className="font-medium text-gray-900">Last Login:</span> {formatDate(selectedUser.lastLogin)}</p>
                    <p><span className="font-medium text-gray-900">Account Created:</span> {formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* User Bookings */}
              <div>
                <h4 className="font-semibold text-lg text-gray-800 mb-4">Recent Bookings</h4>
                {bookingsLoading ? (
                  <div className="flex justify-center py-6 text-blue-600">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="ml-2 text-gray-600">Loading bookings...</span>
                  </div>
                ) : bookingError ? (
                  <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center text-sm shadow-sm">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>Failed to load bookings: {bookingError}</span>
                  </div>
                ) : userBookings.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-100 rounded-lg shadow-sm">
                    <table className="min-w-full text-sm divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Station</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {userBookings.map((booking) => (
                          <tr key={booking._id} className="hover:bg-blue-50">
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-gray-900">{booking.bunkId.name}</div>
                                <div className="text-gray-500 text-xs">{booking.bunkId.address}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-gray-800">{formatDate(booking.startTime)}</div>
                                <div className="text-gray-500 text-xs">
                                  to {formatDate(booking.endTime)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-base text-center py-6 border border-dashed border-gray-200 rounded-lg bg-gray-50">
                    No bookings found for this user.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-auto shadow-2xl transform transition-all duration-300 scale-100 animate-slide-up">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Trash2 className="w-6 h-6 mr-2 text-red-600" />
                Confirm Deletion
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Are you absolutely sure you want to delete this user? This action cannot be undone and all associated data, including bookings, will be permanently removed.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelDelete}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={updateLoading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  {updateLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Deleting...
                    </>
                  ) : (
                    'Delete User'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminUserManagement;