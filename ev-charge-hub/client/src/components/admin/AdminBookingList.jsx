import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock API methods - replace with your actual API
const apiMethods = {
  adminGetAllUsers: async (status, sortBy, sortOrder, search) => {
    // Mock response - replace with actual API call
    return {
      data: {
        success: true,
        users: [
          {
            _id: '507f1f77bcf86cd799439011',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1-555-0123',
            status: 'active',
            createdAt: '2024-01-15T10:30:00Z',
            lastLogin: '2024-06-20T14:22:00Z',
            totalBookings: 12,
            activeBookings: 2
          },
          {
            _id: '507f1f77bcf86cd799439012',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+1-555-0124',
            status: 'inactive',
            createdAt: '2024-02-10T09:15:00Z',
            lastLogin: '2024-06-18T11:45:00Z',
            totalBookings: 8,
            activeBookings: 0
          },
          {
            _id: '507f1f77bcf86cd799439013',
            name: 'Mike Johnson',
            email: 'mike.johnson@example.com',
            phone: '+1-555-0125',
            status: 'suspended',
            createdAt: '2024-03-05T16:20:00Z',
            lastLogin: '2024-06-15T08:30:00Z',
            totalBookings: 15,
            activeBookings: 1
          }
        ],
        totalUsers: 23
      }
    };
  },
  adminUpdateUserStatus: async (userId, status) => {
    return { data: { success: true } };
  },
  adminDeleteUser: async (userId) => {
    return { data: { success: true } };
  }
};

// Mock components
const AdminNavbar = () => (
  <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Admin Panel</span>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
    <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
      <p>&copy; 2025 EV Charge Hub. All rights reserved.</p>
    </div>
  </footer>
);

const AdminUsersList = () => {
  const navigate = useNavigate();
  
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Utility functions
  const getAuthToken = () => {
    // Mock token check - replace with actual localStorage check
    return 'mock-token';
  };
  
  const safeGet = (obj, path, defaultValue = 'N/A') => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || defaultValue;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase() || 'inactive';
    switch (statusLower) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'suspended':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiMethods.adminGetAllUsers(
        filters.status || 'all',
        filters.sortBy,
        filters.sortOrder,
        filters.search
      );

      if (response.data && response.data.success) {
        setUsers(response.data.users || []);
        setTotalUsers(response.data.totalUsers || 0);
        setTotalPages(Math.ceil((response.data.totalUsers || 0) / limit));
      } else {
        throw new Error(response.data?.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  // Update user status
  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await apiMethods.adminUpdateUserStatus(userId, newStatus);
      
      if (response.data && response.data.success) {
        // Update local state
        setUsers(prev => prev.map(user => 
          user._id === userId ? { ...user, status: newStatus } : user
        ));
        
        // Show success message (you can implement toast notifications)
        console.log('User status updated successfully');
      } else {
        throw new Error(response.data?.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status: ' + error.message);
    }
  };

  // View user details
  const viewUserDetails = (userId) => {
    console.log('Viewing user details for:', userId);
    // navigate(`/admin/users/${userId}`);
  };

  // View user bookings
  const viewUserBookings = (userId) => {
    console.log('Viewing user bookings for:', userId);
    // navigate(`/admin/users/${userId}/bookings`);
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiMethods.adminDeleteUser(userId);
      
      if (response.data && response.data.success) {
        // Remove user from local state
        setUsers(prev => prev.filter(user => user._id !== userId));
        setTotalUsers(prev => prev - 1);
        
        console.log('User deleted successfully');
      } else {
        throw new Error(response.data?.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user: ' + error.message);
    }
  };

  // Effects
  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

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
                User Management
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Monitor and manage all registered users
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                <span className="text-sm text-gray-500">Total Users</span>
                <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
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
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400"
                >
                  <option value="createdAt">Registration Date</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="lastLogin">Last Login</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700">
                  Order
                </label>
                <select
                  id="sortOrder"
                  name="sortOrder"
                  value={filters.sortOrder}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-400"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
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
                    placeholder="Search by name, email, ID..."
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Users</h3>
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
                <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Users</h3>
                <p className="text-red-600 mb-4">{error}</p>
                {!getAuthToken() && (
                  <button
                    onClick={() => console.log('Navigate to login')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Go to Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Card Layout */}
        {!loading && !error && (
          <>
            {users.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    There are no users matching your current filters. Try adjusting your search criteria or check back later.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {users.map((user, index) => (
                  <div key={user._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="p-6">
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {(user.name || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {user.name || 'N/A'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ID: {user._id?.substring(0, 12) || 'N/A'}...
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadgeClass(user.status)}`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              user.status?.toLowerCase() === 'active' ? 'bg-emerald-400' :
                              user.status?.toLowerCase() === 'inactive' ? 'bg-gray-400' :
                              user.status?.toLowerCase() === 'suspended' ? 'bg-red-400' :
                              user.status?.toLowerCase() === 'pending' ? 'bg-yellow-400' : 'bg-gray-400'
                            }`}></div>
                            {user.status || 'Inactive'}
                          </span>
                        </div>
                      </div>

                      {/* Card Content Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Contact Information */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                              Contact Details
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Email:</span><br />
                                <span className="text-gray-800">{user.email || 'N/A'}</span>
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Phone:</span><br />
                                <span className="text-gray-800">{user.phone || 'N/A'}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Account Information */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              Account Info
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Registered:</span><br />
                                <span className="text-gray-800">{formatDate(user.createdAt)}</span>
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Last Login:</span><br />
                                <span className="text-gray-800">{formatDate(user.lastLogin)}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Statistics */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                              </svg>
                              Statistics
                            </h4>
                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Total Bookings:</span><br />
                                <span className="text-gray-800 text-lg font-semibold">{user.totalBookings || 0}</span>
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">Active Bookings:</span><br />
                                <span className="text-gray-800 text-lg font-semibold">{user.activeBookings || 0}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => viewUserDetails(user._id)}
                            className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            View Details
                          </button>
                          
                          <button
                            onClick={() => viewUserBookings(user._id)}
                            className="inline-flex items-center px-4 py-2 border border-green-300 text-sm font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            View Bookings
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">Status:</span>
                          <select
                            value={user.status || 'inactive'}
                            onChange={(e) => updateUserStatus(user._id, e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                            aria-label="Update user status"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                            <option value="pending">Pending</option>
                          </select>
                          
                          <button
onClick={() => deleteUser(user._id)}
                            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                            title="Delete user"
                          >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9.586 12l-2.293 2.293a1 1 0 101.414 1.414L10 13.414l2.293 2.293a1 1 0 001.414-1.414L11.414 12l2.293-2.293z" clipRule="evenodd" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-8 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-700">
                    <span>
                      Showing <span className="font-medium">{((currentPage - 1) * limit) + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * limit, totalUsers)}
                      </span>{' '}
                      of <span className="font-medium">{totalUsers}</span> users
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === 1
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      }`}
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white border border-blue-600'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && (
                        <>
                          <span className="px-2 text-gray-500">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                              currentPage === totalPages
                                ? 'bg-blue-600 text-white border border-blue-600'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            }`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === totalPages
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      }`}
                    >
                      Next
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

export default AdminUsersList;