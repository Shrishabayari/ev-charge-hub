import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const AdminBookingsList = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filter, setFilter] = useState("all"); // all, active, cancelled
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 4000);
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setBookings(response.data.data);
      setError("");
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again later.");
      if (err.response && err.response.status === 403) {
        showMessage("error", "You don't have permission to access this resource.");
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [showMessage, navigate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.put(`/api/admin/bookings/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      fetchBookings();
      showMessage("success", "Booking cancelled successfully.");
    } catch (err) {
      console.error("Error cancelling booking:", err);
      showMessage("error", "Failed to cancel booking. Please try again.");
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    const date = new Date(dateTimeStr);
    return `${date.toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    })} at ${date.toLocaleTimeString(undefined, {
      hour: 'numeric', minute: '2-digit', hour12: true
    })}`;
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const filteredBookings = bookings
    .filter(booking => {
      if (filter === "all") return true;
      return booking.status === filter;
    })
    .filter(booking => {
      if (!selectedDate) return true;
      const bookingDate = new Date(booking.startTime).toISOString().split('T')[0];
      return bookingDate === selectedDate;
    })
    .filter(booking => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      const userName = `${booking.userId?.firstName || ""} ${booking.userId?.lastName || ""}`.toLowerCase();
      const stationName = (booking.bunkId?.name || "").toLowerCase();
      const location = (booking.bunkId?.location || "").toLowerCase();
      
      return userName.includes(searchLower) || 
             stationName.includes(searchLower) || 
             location.includes(searchLower);
    });

  if (loading) return <div className="text-center py-10">Loading bookings...</div>;

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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Admin Bookings Management</h2>
      
      {message.text && (
        <div
          className={`mb-4 px-4 py-2 rounded ${message.type === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
            }`}
        >
          {message.text}
        </div>
      )}

      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-40 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              id="search"
              placeholder="Search by user, station or location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="ml-auto self-end">
            <button
              onClick={() => {
                setFilter("all");
                setSelectedDate("");
                setSearchTerm("");
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No bookings found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked On</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className={booking.status === "cancelled" ? "bg-gray-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.userId?.firstName || ""} {booking.userId?.lastName || ""}
                    </div>
                    <div className="text-sm text-gray-500">{booking.userId?.email || "No email"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.bunkId?.name || "Unknown Station"}</div>
                    <div className="text-sm text-gray-500">{booking.bunkId?.location || "No location"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDateTime(booking.startTime)}</div>
                    <div className="text-sm text-gray-500">to {formatDateTime(booking.endTime)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      booking.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(booking.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {booking.status === "active" && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/admin/bookings/${booking._id}`)}
                      className="ml-4 text-blue-600 hover:text-blue-900"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsList;