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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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
      <div className="max-w-4xl mx-auto">
        <RescheduleBookingForm
          booking={rescheduleBooking}
          onRescheduleSuccess={handleRescheduleSuccess}
          onCancel={() => setRescheduleBooking(null)}
        />
      </div>
    );
  }

  // If no bookings
  if (!bookings || bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-gray-200/50">
          <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v7a2 2 0 002 2h4a2 2 0 002-2v-7m-6 0a2 2 0 012-2h4a2 2 0 012 2"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Start your EV charging journey by booking your first charging slot at one of our premium stations.</p>
          <Link 
            to="/user/book-slot" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Book Your First Slot
          </Link>
        </div>
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

  const upcomingBookings = bookings.filter(b => isUpcoming(b.startTime));
  const pastBookings = bookings.filter(b => !isUpcoming(b.startTime));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Upcoming bookings section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Bookings</h2>
          <span className="bg-emerald-100 text-emerald-700 text-sm font-medium px-3 py-1 rounded-full">
            {upcomingBookings.length}
          </span>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
          {upcomingBookings.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {upcomingBookings.map((booking, index) => (
                <div key={booking._id} className="p-6 hover:bg-gray-50/50 transition-all duration-200 group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{getBookingName(booking)}</h3>
                          <p className="text-gray-600 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            {getBookingLocation(booking)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>
                          </svg>
                          <span className="font-medium">Starts:</span> {formatDate(booking.startTime)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                          </svg>
                          <span className="font-medium">Ends:</span> {formatDate(booking.endTime)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-6">
                      <span className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusClass(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      
                      {booking.status === 'active' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRescheduleClick(booking)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v7a2 2 0 002 2h4a2 2 0 002-2v-7m-6 0a2 2 0 012-2h4a2 2 0 012 2"/>
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No upcoming bookings</p>
              <p className="text-gray-400 text-sm mt-1">Your future charging sessions will appear here</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Past bookings section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Past Bookings</h2>
          <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
            {pastBookings.length}
          </span>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
          {pastBookings.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {pastBookings.map((booking, index) => (
                <div key={booking._id} className="p-6 hover:bg-gray-50/50 transition-all duration-200 group opacity-80 hover:opacity-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{getBookingName(booking)}</h3>
                          <p className="text-gray-600 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            {getBookingLocation(booking)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>
                          </svg>
                          <span className="font-medium">Started:</span> {formatDate(booking.startTime)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                          </svg>
                          <span className="font-medium">Ended:</span> {formatDate(booking.endTime)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <span className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getStatusClass(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No past bookings</p>
              <p className="text-gray-400 text-sm mt-1">Your charging history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBookings;