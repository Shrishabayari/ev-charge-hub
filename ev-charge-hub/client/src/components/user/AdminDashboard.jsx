import React from "react";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleAddEvBunk = () => {
    navigate("/admin/add-ev-bunk");
  };

  const handleViewEvBunks = () => {
    navigate("/admin/view-bunks");
  };

  const handleViewBookingSlots = () => {
    navigate("/admin/view-booking-slots");  // Admin can view available booking slots
  };

  const handleViewMyBookings = () => {
    navigate("/admin/my-bookings");  // Admin can view their own bookings
  };

  const handleViewAdminBookings = () => {
    navigate("/admin/admin-bookings");  // Admin-specific bookings management
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>

      <div className="flex flex-col items-center gap-6">
        <button
          onClick={handleAddEvBunk}
          className="w-60 py-3 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-md"
        >
          Add New EV Bunk
        </button>

        <button
          onClick={handleViewEvBunks}
          className="w-60 py-3 px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-md"
        >
          View EV Bunks
        </button>

        {/* New Buttons for Booking Management */}
        <button
          onClick={handleViewBookingSlots}
          className="w-60 py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md"
        >
          View Booking Slots
        </button>

        <button
          onClick={handleViewMyBookings}
          className="w-60 py-3 px-6 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 shadow-md"
        >
          View My Bookings
        </button>

        <button
          onClick={handleViewAdminBookings}
          className="w-60 py-3 px-6 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-md"
        >
          View Admin Bookings
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
