import React, { useState, useEffect } from "react";
import axios from "axios";
import RescheduleBookingForm from "../../components/user/ResheduleSlot";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rescheduleBooking, setRescheduleBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      // Filter out only active bookings
      const activeBookings = response.data.data.filter(
        booking => booking.status === "active"
      );
      
      setBookings(activeBookings);
      setError("");
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load your bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await axios.put(`/api/bookings/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      // Refresh bookings list after cancellation
      fetchBookings();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const handleRescheduleClick = (booking) => {
    setRescheduleBooking(booking);
  };

  const handleRescheduleSuccess = (updatedBooking) => {
    // Update the booking in the list
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking._id === updatedBooking._id ? updatedBooking : booking
      )
    );
    
    // Close the reschedule form
    setRescheduleBooking(null);
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    
    const date = new Date(dateTimeStr);
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    
    return `${date.toLocaleDateString(undefined, dateOptions)} at ${date.toLocaleTimeString(undefined, timeOptions)}`;
  };

  if (loading) {
    return <div className="text-center py-10">Loading your bookings...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchBookings}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // If reschedule form is open, show only that
  if (rescheduleBooking) {
    return (
      <RescheduleBookingForm 
        booking={rescheduleBooking}
        onRescheduleSuccess={handleRescheduleSuccess}
        onCancel={() => setRescheduleBooking(null)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Your EV Charging Bookings</h2>
      
      {bookings.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">You don't have any active bookings.</p>
          <a 
            href="/book" 
            className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Book a Slot
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div 
              key={booking._id} 
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">
                    {booking.bunkId?.name || "Unknown Station"}
                  </h3>
                  <p className="text-gray-600">{booking.bunkId?.location || "Location not specified"}</p>
                  
                  <div className="mt-2">
                    <p>
                      <span className="text-gray-600">Start:</span> {formatDateTime(booking.startTime)}
                    </p>
                    <p>
                      <span className="text-gray-600">End:</span> {formatDateTime(booking.endTime)}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRescheduleClick(booking)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              
              <div className="mt-2 pt-2 border-t text-sm text-gray-500">
                Booked on {formatDateTime(booking.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsList;