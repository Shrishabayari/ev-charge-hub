import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RescheduleBookingForm from '../../components/user/ResheduleSlot';

const UserBookings = ({ bookings, onCancelBooking, onBookingUpdate, showMessage }) => {
  const [rescheduleBooking, setRescheduleBooking] = useState(null);
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

  // Handle booking cancellation with confirmation
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    if (onCancelBooking) {
      await onCancelBooking(bookingId);
    }
  };

  // Handle reschedule click
  const handleRescheduleClick = (booking) => {
    setRescheduleBooking(booking);
  };

  // Handle reschedule success
  const handleRescheduleSuccess = (updatedBooking) => {
    if (onBookingUpdate) {
      onBookingUpdate(updatedBooking);
    }
    setRescheduleBooking(null);
    if (showMessage) {
      showMessage("success", "Booking rescheduled successfully.");
    }
  };

  // If reschedule form is active, show it
  if (rescheduleBooking) {
    return (
      <RescheduleBookingForm
        booking={rescheduleBooking}
        onRescheduleSuccess={handleRescheduleSuccess}
        onCancel={() => setRescheduleBooking(null)}
      />
    );
  }

  // If no bookings
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
        <Link 
          to="/user/book-slot" 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Book Your First Slot
        </Link>
      </div>
    );
  }

  // Safe access to properties using optional chaining
  const getBookingName = (booking) => {
    return booking?.bunkId?.name || 'Unknown Station';
  };

  const getBookingLocation = (booking) => {
    return booking?.bunkId?.location || 'Location not specified';
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
                        <p className="text-gray-600 text-sm">{getBookingLocation(booking)}</p>
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
                            <button
                              onClick={() => handleRescheduleClick(booking)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Reschedule
                            </button>
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
                        <p className="text-gray-600 text-sm">{getBookingLocation(booking)}</p>
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