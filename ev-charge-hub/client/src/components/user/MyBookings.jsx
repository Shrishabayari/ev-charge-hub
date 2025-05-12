// components/user/MyBookings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings when component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication token missing');
          return;
        }
    
        console.log('Token being used:', token); // Log the token
    
        const response = await axios.get('/api/bookings/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token,
            // Add this to prevent 304 caching
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
    
        console.log('Full API Response:', response);
        console.log('Response Data:', response.data);
    
        // More aggressive validation
        if (!response.data) {
          throw new Error('No data received from server');
        }
    
        if (!response.data.success) {
          throw new Error(response.data.message || 'Server returned unsuccessful response');
        }
    
        if (!Array.isArray(response.data.data)) {
          console.error('Invalid data structure:', response.data);
          throw new Error('Invalid data format received from server');
        }
    
        setBookings(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Complete Booking Fetch Error:', {
          errorObject: err,
          errorName: err.name,
          errorMessage: err.message,
          responseData: err.response?.data,
          responseStatus: err.response?.status
        });
    
        // More detailed error handling
        if (err.response) {
          // The request was made and the server responded with a status code
          switch (err.response.status) {
            case 401:
              setError('Unauthorized. Please log in again.');
              break;
            case 403:
              setError('You do not have permission to view bookings.');
              break;
            case 404:
              setError('Bookings endpoint not found.');
              break;
            case 500:
              setError('Server error. Please try again later.');
              break;
            default:
              setError(err.response.data.message || 'An unexpected error occurred.');
          }
        } else if (err.request) {
          // The request was made but no response was received
          setError('No response from server. Check your network connection.');
        } else {
          // Something happened in setting up the request
          setError(err.message || 'Error setting up the request.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Helper function to format dates in a readable way
  const formatDate = (dateString) => {
    try {
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  // Helper function to get appropriate status badge class
  const getStatusClass = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate if a booking is upcoming or past
  const isUpcoming = (startTime) => {
    try {
      return new Date(startTime) > new Date();
    } catch (error) {
      return false;
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await axios.put(`/api/bookings/cancel/${bookingId}`, {}, {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (response.data && response.data.success) {
        // Update the bookings state to reflect cancellation
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status: 'cancelled' } 
              : booking
          )
        );
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading your bookings...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <h3 className="text-red-800 font-medium mb-2">Something went wrong</h3>
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  // If no bookings
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
        <a 
          href="/user/bookings/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Book Your First Slot
        </a>
      </div>
    );
  }

  // Safe access to properties using optional chaining
  const getBookingName = (booking) => {
    return booking?.bunkId?.name || 'Unknown Station';
  };

  return (
    <div>
      {/* Upcoming bookings section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4 text-gray-700">Upcoming Bookings</h2>
        <div className="bg-white rounded-lg overflow-hidden shadow">
          {bookings.filter(b => isUpcoming(b.startTime)).length > 0 ? (
            <div className="divide-y divide-gray-200">
              {bookings
                .filter(booking => isUpcoming(booking.startTime))
                .map(booking => (
                  <div key={booking._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{getBookingName(booking)}</h3>
                        <div className="text-sm text-gray-500 mt-1">
                          <div>Start: {formatDate(booking.startTime)}</div>
                          <div>End: {formatDate(booking.endTime)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        
                        {booking.status === 'active' && (
                          <div className="flex space-x-2">
                            <a
                              href={`/user/bookings/reschedule/${booking._id}`}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Reschedule
                            </a>
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No upcoming bookings
            </div>
          )}
        </div>
      </div>
      
      {/* Past bookings section */}
      <div>
        <h2 className="text-lg font-medium mb-4 text-gray-700">Past Bookings</h2>
        <div className="bg-white rounded-lg overflow-hidden shadow">
          {bookings.filter(b => !isUpcoming(b.startTime)).length > 0 ? (
            <div className="divide-y divide-gray-200">
              {bookings
                .filter(booking => !isUpcoming(booking.startTime))
                .map(booking => (
                  <div key={booking._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{getBookingName(booking)}</h3>
                        <div className="text-sm text-gray-500 mt-1">
                          <div>Start: {formatDate(booking.startTime)}</div>
                          <div>End: {formatDate(booking.endTime)}</div>
                        </div>
                      </div>
                      
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No past bookings
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBookings;