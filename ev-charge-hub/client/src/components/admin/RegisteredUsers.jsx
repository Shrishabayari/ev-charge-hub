import React, { useState, useEffect } from 'react';
import { Search, Eye, Calendar, MapPin, Phone, Mail, User, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'; // Added Loader2 for loading spinner
import AdminNavbar from "../common/navbars/AdminNavbar"; // Assuming this is your AdminNavbar component

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [error, setError] = useState(null); // State for main user fetch error
  const [bookingError, setBookingError] = useState(null); // State for booking fetch error

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const token = localStorage.getItem('adminToken'); // Adjust based on your auth implementation

      if (!token) {
        setError('Authentication token not found. Please log in as admin.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data); // Initialize filtered users with all users
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  // Fetch user bookings from API
  const fetchUserBookings = async (userId) => {
    try {
      setBookingsLoading(true);
      setBookingError(null); // Clear previous booking errors
      const token = localStorage.getItem('adminToken');

      if (!token) {
        setBookingError('Authentication token not found. Please log in as admin to view bookings.');
        setBookingsLoading(false);
        return;
      }

      const response = await fetch(`/api/admin/users/${userId}/bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user bookings');
      }

      const data = await response.json();
      setUserBookings(data);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      setBookingError(error.message || 'Failed to load bookings for this user.');
      setUserBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) { // Ensure status is lowercased for consistent matching
      case 'active':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'completed':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'cancelled':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'pending': // Added pending status
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleMoreInfo = (user) => {
    setSelectedUser(user);
    fetchUserBookings(user._id);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserBookings([]);
    setBookingError(null); // Clear booking error when closing modal
  };

  // Full page loading state
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

  // Full page error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6 animate-pulse" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3 lg:text-3xl">Error Loading Users</h3>
          <p className="text-red-700 mb-6 text-lg lg:text-xl">{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-md transform hover:scale-105 lg:text-lg"
          >
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
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8"> {/* Main container for the admin panel */}
            {/* Header */}
            <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 lg:text-5xl">User Management</h1>
            <p className="text-xl text-gray-600 lg:text-2xl">Oversee and manage all registered users and their activities.</p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 lg:w-7 lg:h-7" />
                <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-12 pr-6 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-lg lg:text-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider lg:text-lg">
                        User
                    </th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider lg:text-lg">
                        Email
                    </th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider lg:text-lg">
                        Join Date
                    </th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider lg:text-lg">
                        Total Bookings
                    </th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider lg:text-lg">
                        Status
                    </th>
                    <th className="px-6 py-4 text-left text-base font-semibold text-gray-600 uppercase tracking-wider lg:text-lg">
                        Actions
                    </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 lg:h-14 lg:w-14">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center text-blue-800 font-bold text-lg shadow-sm lg:h-14 lg:w-14 lg:text-xl">
                                {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-6 w-6 text-blue-600 lg:h-7 lg:w-7" />}
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-lg font-medium text-gray-900 lg:text-xl">
                                {user.name}
                                </div>
                            </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-base text-gray-800 lg:text-lg">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-base text-gray-800 lg:text-lg">
                            {formatDate(user.createdAt)}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-base text-gray-800 font-semibold lg:text-lg">{user.totalBookings || 0}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(user.status)} lg:text-base lg:px-4 lg:py-1.5`}>
                            {getStatusIcon(user.status)}
                            <span className="ml-2">{user.status}</span>
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-base font-medium">
                            <button
                            onClick={() => handleMoreInfo(user)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors duration-200 lg:px-5 lg:py-2.5 lg:text-lg"
                            >
                            <Eye className="w-4 h-4 mr-2 lg:w-5 lg:h-5" />
                            View Details
                            </button>
                        </td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="6" className="text-center py-10 text-gray-500 text-xl lg:text-2xl">
                        No users found.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
            </div>

            {/* Modal for User Details */}
            {selectedUser && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto transform scale-95 animate-scale-in">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 lg:text-3xl">
                    User Details - {selectedUser.name}
                    </h3>
                    <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 lg:p-3"
                    >
                    <XCircle className="w-7 h-7 lg:w-8 lg:h-8" />
                    </button>
                </div>

                {/* User Information */}
                <div className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
                        <h4 className="text-xl font-semibold text-blue-800 mb-4 flex items-center lg:text-2xl">
                        <User className="w-5 h-5 mr-2 text-blue-600 lg:w-6 lg:h-6" /> Personal Information
                        </h4>
                        <div className="space-y-3 text-gray-700">
                        <div className="flex items-center">
                            <User className="w-4 h-4 mr-3 text-gray-500 lg:w-5 lg:h-5" />
                            <span className="text-lg lg:text-xl">Name: <span className="font-medium">{selectedUser.name}</span></span>
                        </div>
                        <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-3 text-gray-500 lg:w-5 lg:h-5" />
                            <span className="text-lg lg:text-xl">Email: <span className="font-medium">{selectedUser.email}</span></span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-3 text-gray-500 lg:w-5 lg:h-5" />
                            <span className="text-lg lg:text-xl">Joined: <span className="font-medium">{formatDate(selectedUser.createdAt)}</span></span>
                        </div>
                        {selectedUser.phone && (
                            <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-3 text-gray-500 lg:w-5 lg:h-5" />
                            <span className="text-lg lg:text-xl">Phone: <span className="font-medium">{selectedUser.phone}</span></span>
                            </div>
                        )}
                        </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-100">
                        <h4 className="text-xl font-semibold text-green-800 mb-4 flex items-center lg:text-2xl">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600 lg:w-6 lg:h-6" /> Activity Summary
                        </h4>
                        <div className="space-y-3 text-gray-700">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-3 text-gray-500 lg:w-5 lg:h-5" />
                            <span className="text-lg lg:text-xl">Total Bookings: <span className="font-medium">{selectedUser.totalBookings || 0}</span></span>
                        </div>
                        <div className="flex items-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-base font-semibold border ${getStatusColor(selectedUser.status)} lg:text-lg lg:px-4 lg:py-1.5`}>
                            {getStatusIcon(selectedUser.status)}
                            <span className="ml-2">{selectedUser.status}</span>
                            </span>
                        </div>
                        {/* Add more summary fields if available, e.g., last login, vehicle type */}
                        {selectedUser.vehicleType && (
                            <div className="flex items-center">
                            <svg className="w-4 h-4 mr-3 text-gray-500 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 1m3-1V4m0 0h-2m4 0h2m-6 0h2"></path></svg>
                            <span className="text-lg lg:text-xl">Vehicle Type: <span className="font-medium">{selectedUser.vehicleType}</span></span>
                            </div>
                        )}
                        </div>
                    </div>
                    </div>
                </div>

                {/* Booking History Section */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4 border-gray-200 lg:text-3xl">Booking History</h4>

                    {bookingsLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin h-10 w-10 text-blue-500 lg:h-12 lg:w-12" />
                        <p className="ml-3 text-xl text-gray-600 lg:text-2xl">Loading bookings...</p>
                    </div>
                    ) : bookingError ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center text-lg lg:text-xl">
                        <AlertCircle className="h-6 w-6 mx-auto mb-3 text-red-500 lg:h-7 lg:w-7" />
                        <p>{bookingError}</p>
                        <button
                        onClick={() => fetchUserBookings(selectedUser._id)}
                        className="mt-4 bg-red-200 px-4 py-2 rounded-md text-base font-medium text-red-800 hover:bg-red-300 transition-colors lg:text-lg"
                        >
                        Retry Loading Bookings
                        </button>
                    </div>
                    ) : (
                    <div className="grid grid-cols-1 gap-6 pr-2"> {/* Changed to grid-cols-1 */}
                        {userBookings.length > 0 ? (
                        userBookings.map((booking) => (
                            <div key={booking._id} className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                <div className="flex items-center mb-2">
                                    <MapPin className="w-5 h-5 mr-2 text-blue-500 lg:w-6 lg:h-6" />
                                    <h5 className="text-xl font-semibold text-gray-900 lg:text-2xl">
                                    {booking.bunkId?.name || 'Unknown Station'}
                                    </h5>
                                </div>
                                <p className="text-base text-gray-600 mb-2 flex items-center lg:text-lg">
                                    <MapPin className="w-4 h-4 mr-2 text-gray-400 lg:w-5 lg:h-5" />
                                    {booking.bunkId?.address || 'Address not available'}
                                </p>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-base font-semibold border ${getStatusColor(booking.status)} lg:text-lg lg:px-4 lg:py-2`}>
                                    {getStatusIcon(booking.status)}
                                    <span className="ml-2">{booking.status}</span>
                                </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-base text-gray-700 lg:text-lg">
                                <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-500 lg:w-5 lg:h-5" />
                                <span className="font-medium">Start:</span> {formatDate(booking.startTime)}
                                </div>
                                <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-500 lg:w-5 lg:h-5" />
                                <span className="font-medium">End:</span> {formatDate(booking.endTime)}
                                </div>
                                <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500 lg:w-5 lg:h-5" />
                                <span className="font-medium">Booked:</span> {formatDate(booking.createdAt)}
                                </div>
                                {booking.slotNumber && (
                                <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-500 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span className="font-medium">Slot:</span> {booking.slotNumber}
                                </div>
                                )}
                            </div>
                            </div>
                        ))
                        ) : (
                        <div className="text-center py-8 text-gray-500 text-lg lg:text-xl">
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
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 font-semibold transition-colors duration-200 shadow-sm lg:px-8 lg:py-4 lg:text-lg"
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
