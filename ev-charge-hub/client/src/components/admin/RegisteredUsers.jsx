import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, Eye, Calendar, MapPin, Mail, User, Clock, 
  CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw, 
  Filter, UserCheck, Activity, Edit, Trash2, Save, X,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';

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

  // Auth token state
  const [authToken, setAuthToken] = useState(null);

  // Initialize auth token on component mount
  useEffect(() => {
    // Get auth token from localStorage, sessionStorage, or context
    // Note: In production, consider using a more secure method like HTTP-only cookies
    const token = localStorage?.getItem('authToken') || 
                  sessionStorage?.getItem('authToken') || 
                  null;
    setAuthToken(token);
  }, []);

  // API call helper with proper error handling
  const makeApiCall = useCallback(async (url, options = {}) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
        ...options.headers
      };

      const response = await fetch(url, {
        ...options,
        headers
      });

      // Check if response is HTML (common for 404 pages)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error(`API endpoint not found: ${url}. Server returned HTML instead of JSON.`);
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      
      // Provide more helpful error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      
      if (error.message.includes('Unexpected token')) {
        throw new Error('Server returned invalid JSON. Check API endpoint configuration.');
      }
      
      throw error;
    }
  }, [authToken]);

  // Fetch users with enhanced error handling
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await makeApiCall('/api/admin/users');
      
      // Validate and sanitize user data
      const validatedUsers = (data.users || data || []).map(user => ({
        _id: user._id || '',
        name: user.name || 'Unknown User',
        email: user.email || 'No email provided',
        status: user.status || 'inactive',
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
      
      // Validate and sanitize booking data
      const bookings = data.bookings || data || [];
      const validatedBookings = bookings.map(booking => ({
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
        body: JSON.stringify({ status })
      });
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, status } : user
        )
      );
      
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(prev => ({ ...prev, status }));
      }
      
      setEditingUser(null);
      setEditForm({});
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

  // Search users
  const searchUsers = useCallback(async (query) => {
    if (!query.trim()) {
      fetchUsers();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await makeApiCall(`/api/admin/users/search?q=${encodeURIComponent(query)}`);
      
      const users = data.users || data || [];
      const validatedUsers = users.map(user => ({
        _id: user._id || '',
        name: user.name || 'Unknown User',
        email: user.email || 'No email provided',
        status: user.status || 'inactive',
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
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'banned': return 'text-red-600 bg-red-100';
      case 'suspended': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
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

  const handleEditUser = useCallback((user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      status: user.status
    });
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingUser) return;

    try {
      setUpdateLoading(true);
      
      await makeApiCall(`/api/admin/users/${editingUser}`, {
        method: 'PUT',
        body: JSON.stringify(editForm)
      });
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === editingUser ? { ...user, ...editForm } : user
        )
      );
      
      if (selectedUser && selectedUser._id === editingUser) {
        setSelectedUser(prev => ({ ...prev, ...editForm }));
      }
      
      setEditingUser(null);
      setEditForm({});
    } catch (error) {
      alert(`Failed to update user: ${error.message}`);
    } finally {
      setUpdateLoading(false);
    }
  }, [editingUser, editForm, makeApiCall, selectedUser]);

  const handleCancelEdit = useCallback(() => {
    setEditingUser(null);
    setEditForm({});
  }, []);

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-blue-600" />
                User Management
              </h1>
              <p className="text-gray-600 mt-1">Manage users, view their bookings, and monitor activity</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Search and Filters */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="banned">Banned</option>
                    </select>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field);
                        setSortOrder(order);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="createdAt-desc">Newest First</option>
                      <option value="createdAt-asc">Oldest First</option>
                      <option value="name-asc">Name A-Z</option>
                      <option value="name-desc">Name Z-A</option>
                      <option value="totalBookings-desc">Most Bookings</option>
                      <option value="totalBookings-asc">Least Bookings</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading users...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-12 text-red-600">
                    <AlertCircle className="w-6 h-6 mr-2" />
                    <div className="text-center">
                      <div className="font-medium">{error}</div>
                    </div>
                  </div>
                ) : paginatedUsers.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-gray-500">
                    <User className="w-6 h-6 mr-2" />
                    <span>No users found</span>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedUsers.map((user) => (
                        <tr
                          key={user._id}
                          className={`hover:bg-gray-50 cursor-pointer ${
                            selectedUser?._id === user._id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleUserSelect(user)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingUser === user._id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editForm.name}
                                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  placeholder="Name"
                                />
                                <input
                                  type="email"
                                  value={editForm.email}
                                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                  placeholder="Email"
                                />
                              </div>
                            ) : (
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingUser === user._id ? (
                              <select
                                value={editForm.status}
                                onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                                <option value="banned">Banned</option>
                              </select>
                            ) : (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                {getStatusIcon(user.status)}
                                <span className="ml-1 capitalize">{user.status}</span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.totalBookings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {editingUser === user._id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveEdit();
                                  }}
                                  disabled={updateLoading}
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelEdit();
                                  }}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditUser(user);
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(user._id);
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, processedUsers.length)} of {processedUsers.length} users
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        <ChevronsLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                        {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        <ChevronsRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Details Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
              {selectedUser ? (
                <div>
                  {/* User Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                            {getStatusIcon(selectedUser.status)}
                            <span className="ml-1 capitalize">{selectedUser.status}</span>
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Total Bookings</p>
                        <p className="text-lg font-semibold text-gray-900">{selectedUser.totalBookings}</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {formatDate(selectedUser.createdAt)}</span>
                      </div>
                      {selectedUser.lastLogin && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>Last login {formatDate(selectedUser.lastLogin)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Bookings */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Recent Bookings</h4>
                      <Activity className="w-5 h-5 text-gray-400" />
                    </div>

                    {bookingsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                        <span className="ml-2 text-sm text-gray-600">Loading bookings...</span>
                      </div>
                    ) : bookingError ? (
                      <div className="flex items-center justify-center py-8 text-red-600">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span className="text-sm">{bookingError}</span>
                      </div>
                    ) : userBookings.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No bookings found</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {userBookings.slice(0, 10).map((booking) => (
                          <div key={booking._id} className="p-3 bg-gray-50 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                booking.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                                {booking.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                                {booking.status === 'active' && <Clock className="w-3 h-3 mr-1" />}
                                <span className="capitalize">{booking.status}</span>
                              </span>
                              <span className="text-xs text-gray-500">
                                {booking.slotNumber && `Slot ${booking.slotNumber}`}
                              </span>
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <span className="font-medium text-gray-900">{booking.bunkId.name}</span>
                              </div>
                              <div className="text-xs text-gray-500 ml-5">
                                {booking.bunkId.address}
                              </div>
                              {booking.startTime && booking.endTime && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 ml-5">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {formatDate(booking.startTime)} - {formatDate(booking.endTime)}
                                  </span>
                                </div>
                              )}
                              <div className="text-xs text-gray-500 ml-5">
                                Booked {formatDate(booking.createdAt)}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {userBookings.length > 10 && (
                          <div className="text-center py-2">
                            <span className="text-sm text-gray-500">
                              Showing 10 of {userBookings.length} bookings
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h5>
                    <div className="space-y-2">
                      <select
                        value={selectedUser.status}
                        onChange={(e) => handleStatusChange(selectedUser._id, e.target.value)}
                        disabled={updateLoading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                        <option value="banned">Banned</option>
                      </select>
                      
                      <button
                        onClick={() => handleDeleteUser(selectedUser._id)}
                        disabled={updateLoading}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete User
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Eye className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a User</h3>
                  <p className="text-gray-500">Choose a user from the list to view their details and manage their account</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user? All their bookings and data will be permanently removed.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={updateLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={updateLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {updateLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {updateLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-700">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;