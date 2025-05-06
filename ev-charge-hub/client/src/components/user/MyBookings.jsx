import React, { useState, useEffect } from "react";
import axios from "axios";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setBookings(res.data.bookings);
      setError("");
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await axios.put(`/api/bookings/cancel/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      // Update the local state
      setBookings(bookings.map(booking => 
        booking._id === id ? { ...booking, status: "cancelled" } : booking
      ));
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking");
    }
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isUpcoming = (slotTime) => {
    return new Date(slotTime) > new Date();
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'booked': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Bookings</h2>
        <button 
          onClick={fetchBookings}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading your bookings...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">You don't have any bookings yet</div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
              <div 
                key={booking._id} 
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {booking.bunkId.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {booking.bunkId.location}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <p className="text-gray-700">
                        <span className="font-medium">Slot Time:</span> {formatDateTime(booking.slotTime)}
                      </p>
                      <p className="text-gray-700 text-sm mt-1">
                        <span className="font-medium">Booked on:</span> {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {booking.status === 'booked' && isUpcoming(booking.slotTime) && (
                      <div className="mt-3 sm:mt-0">
                        <button
                          onClick={() => handleCancel(booking._id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings;