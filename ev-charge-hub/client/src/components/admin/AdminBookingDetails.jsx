import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

const AdminBookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/admin/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setBooking(response.data.data);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load booking details. Please try again later.");
        if (err.response && err.response.status === 403) {
          setMessage({ type: "error", text: "You don't have permission to access this resource." });
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate]);

  const handleCancelBooking = async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await axios.put(`/api/admin/bookings/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      // Update the local booking state
      setBooking(prev => ({
        ...prev,
        status: "cancelled"
      }));
      
      setMessage({ type: "success", text: "Booking cancelled successfully." });
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setMessage({ type: "error", text: "Failed to cancel booking. Please try again." });
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

  if (loading) return <div className="text-center py-10">Loading booking details...</div>;

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate('/admin/bookings')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/bookings')}
          className="py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          ← Back to Bookings
        </button>
      </div>

      {message.text && (
        <div
          className={`mb-4 px-4 py-2 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Booking Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Detailed information about the booking.
            </p>
          </div>
          <div>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                booking.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {booking.status.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Booking ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {booking._id}
              </dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">User</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div>
                  <strong>Name:</strong> {booking.userId?.firstName || ""} {booking.userId?.lastName || ""}
                </div>
                <div>
                  <strong>Email:</strong> {booking.userId?.email || "No email"}
                </div>
                <div>
                  <strong>Phone:</strong> {booking.userId?.phone || "No phone number"}
                </div>
              </dd>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Charging Station</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div>
                  <strong>Name:</strong> {booking.bunkId?.name || "Unknown Station"}
                </div>
                <div>
                  <strong>Location:</strong> {booking.bunkId?.location || "No location"}
                </div>
                {booking.bunkId?.connectorType && (
                  <div>
                    <strong>Connector:</strong> {booking.bunkId.connectorType}
                  </div>
                )}
              </dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Time Slot</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div><strong>Start:</strong> {formatDateTime(booking.startTime)}</div>
                <div><strong>End:</strong> {formatDateTime(booking.endTime)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Duration: {booking.duration || "N/A"} minutes
                </div>
              </dd>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Booking Details</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div><strong>Created:</strong> {formatDateTime(booking.createdAt)}</div>
                {booking.updatedAt && (
                  <div><strong>Last Updated:</strong> {formatDateTime(booking.updatedAt)}</div>
                )}
                {booking.cancelledAt && (
                  <div><strong>Cancelled On:</strong> {formatDateTime(booking.cancelledAt)}</div>
                )}
              </dd>
            </div>
            
            {booking.vehicleInfo && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Vehicle Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div><strong>Model:</strong> {booking.vehicleInfo.model || "N/A"}</div>
                  {booking.vehicleInfo.licensePlate && (
                    <div><strong>License Plate:</strong> {booking.vehicleInfo.licensePlate}</div>
                  )}
                </dd>
              </div>
            )}
            
            {booking.notes && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {booking.notes}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {booking.status === "active" && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCancelBooking}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBookingDetail;