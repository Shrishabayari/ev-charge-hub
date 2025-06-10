import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, Eye, Calendar, MapPin, Mail, User, Clock, 
  CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw, 
  Filter, UserCheck, Activity, Edit, Trash2, Save, X
} from 'lucide-react';
import AdminNavbar from "../common/navbars/AdminNavbar";
import Footer from "../common/Footer";

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
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Edit states
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

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

  // Update user
  const updateUser = useCallback(async (userId, updateData) => {
    try {
      setUpdateLoading(true);
      await makeApiCall(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, ...updateData } : user
        )
      );
      
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(prev => ({ ...prev, ...updateData }));
      }
      
      setEditingUser(null);
      setEditForm({});
    } catch (error) {
      alert(`Failed to update user: ${error.message}`);
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
      
      // Remove from local state
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

  // Update booking status
  const updateBookingStatus = useCallback(async (bookingId, newStatus) => {
    try {
      await makeApiCall(`/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      
      // Update local booking state
      setUserBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
    } catch (error) {
      alert(`Failed to update booking status: ${error.message}`);
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
        user.email.toLowerCase().includes(searchLower) 
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
    setEditingUser(null);
    setEditForm({});
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

  const startEdit = useCallback((user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      email: user.email || '',
      status: user.status,
      isActive: user.isActive
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingUser(null);
    setEditForm({});
  }, []);

  const saveEdit = useCallback(() => {
    if (editingUser) {
      updateUser(editingUser, editForm);
    }
  }, [editingUser, editForm, updateUser]);

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
      <AdminNavbar/>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-10">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-5 text-center">
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
          <div className="mb-1 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search users by name or email ..."
                  className="w-full pl-12 pr-6 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-lg"
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
                  className="pl-10 pr-8 py-1.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-lg bg-white"
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
                className="px-6 py-1.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-sm"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
  <thead>
    <tr className="border-b">
      <th 
        className="text-align-center p-3 cursor-pointer hover:bg-gray-50" 
        onClick={() => handleSort('name')}
      >
        User
        {sortBy === 'name' && (
          <span className="ml-1">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </th>
      <th 
        className="text-center p-3 cursor-pointer hover:bg-gray-50" 
        onClick={() => handleSort('email')}
      >
        Email
        {sortBy === 'email' && (
          <span className="ml-1">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </th>
      <th 
        className="text-center p-3 cursor-pointer hover:bg-gray-50" 
        onClick={() => handleSort('totalBookings')}
      >
        Total Bookings
        {sortBy === 'totalBookings' && (
          <span className="ml-1">
            {sortOrder === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </th>
      <th 
        className="text-center p-3 cursor-pointer hover:bg-gray-50" 
        onClick={() => handleSort('status')}
      >
        Status
        {sortBy === 'status' && (
          <span className="ml-1">
            {sortOrder === 'asc' ? '↓' : '↑'}
          </span>
        )}
      </th>
      <th className="text-center p-3">
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
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-base text-gray-800 ">{user.email}</div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-base text-gray-800 font-semibold">{user.totalBookings}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(user.status)}`}>
                            {getStatusIcon(user.status)}
                            <span className="ml-2 capitalize">{user.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium justify-center">
                          <div className="flex space-x-2" >
                            <button
                              onClick={() => handleMoreInfo(user)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors duration-200"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => startEdit(user)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-md transition-colors duration-200"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(user)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                          </div>
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

          {/* Edit User Modal */}
          {editingUser && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
                  <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editForm.status || 'inactive'}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={editForm.isActive || false}
                      onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Account is active
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={saveEdit}
                    disabled={updateLoading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {updateLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-red-900">Confirm Delete</h3>
                  <button 
                    onClick={() => setShowDeleteConfirm(null)} 
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 mb-2">
                    Are you sure you want to delete this user?
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold text-gray-900">{showDeleteConfirm.name}</p>
                    <p className="text-gray-600">{showDeleteConfirm.email}</p>
                  </div>
                  <p className="text-red-600 text-sm mt-2">
                    This action cannot be undone.
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => deleteUser(showDeleteConfirm._id)}
                    disabled={updateLoading}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {updateLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-2" />
                    )}
                    {updateLoading ? 'Deleting...' : 'Delete User'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* User Details Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-bold text-2xl mr-4">
                        {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                        <p className="text-blue-100">{selectedUser.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={closeModal}
                      className="text-white hover:text-gray-200 transition-colors duration-200"
                    >
                      <X className="w-8 h-8" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  {/* User Information */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-600" />
                        User Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <Mail className="w-4 h-4 mr-3 text-gray-500" />
                          <span className="font-medium mr-2">Email:</span>
                          <span>{selectedUser.email}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                          <span className="font-medium mr-2">Joined:</span>
                          <span>{formatDate(selectedUser.createdAt)}</span>
                        </div>
                        {selectedUser.lastLogin && (
                          <div className="flex items-center text-gray-700">
                            <Clock className="w-4 h-4 mr-3 text-gray-500" />
                            <span className="font-medium mr-2">Last Login:</span>
                            <span>{formatDate(selectedUser.lastLogin)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-green-600" />
                        Account Status
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-700 mr-3">Status:</span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(selectedUser.status)}`}>
                            {getStatusIcon(selectedUser.status)}
                            <span className="ml-2 capitalize">{selectedUser.status}</span>
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <span className="font-medium mr-3">Active Account:</span>
                          <span className={selectedUser.isActive ? 'text-green-600' : 'text-red-600'}>
                            {selectedUser.isActive ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <span className="font-medium mr-3">Total Bookings:</span>
                          <span className="text-blue-600 font-semibold">{selectedUser.totalBookings}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking History */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                      Booking History
                    </h3>

                    {bookingsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin h-8 w-8 text-blue-600 mr-3" />
                        <span className="text-gray-600">Loading bookings...</span>
                      </div>
                    ) : bookingError ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                        <p className="text-red-600 mb-4">{bookingError}</p>
                        <button
                          onClick={() => fetchUserBookings(selectedUser._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                          <RefreshCw className="w-4 h-4 mr-2 inline" />
                          Retry
                        </button>
                      </div>
                    ) : userBookings.length > 0 ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {userBookings.map((booking) => (
                          <div key={booking._id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="flex items-center mb-1">
                                  <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                                  <span className="font-medium text-gray-900">{booking.bunkId.name}</span>
                                </div>
                                <p className="text-sm text-gray-600 ml-6">{booking.bunkId.address}</p>
                              </div>
                              <div className="ml-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}>
                                  {getStatusIcon(booking.status)}
                                  <span className="ml-1 capitalize">{booking.status}</span>
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-3">
                              <div>
                                <span className="font-medium">Slot:</span> {booking.slotNumber || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Start:</span> {formatDate(booking.startTime)}
                              </div>
                              <div>
                                <span className="font-medium">End:</span> {formatDate(booking.endTime)}
                              </div>
                            </div>
                            
                            {/* Admin Actions for Bookings */}
                            <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
                              {booking.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                                    className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                    className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors duration-200"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {booking.status === 'confirmed' && (
                                <button
                                  onClick={() => updateBookingStatus(booking._id, 'completed')}
                                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors duration-200"
                                >
                                  Mark Complete
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No bookings found for this user.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div><Footer/>
    </div>
  );
};

export default AdminUserManagement;