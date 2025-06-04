import React from "react";
import { useNavigate } from 'react-router-dom';
import AdminNavbar from "../common/navbars/AdminNavbar";
const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleAddEvBunk = () => {
    navigate("/admin/add-bunk");
  };

  const handleViewEvBunks = () => {
    navigate("/admin/view-bunks");
  };

  const handleViewBookingSlots = () => {
    navigate("/admin/view-bookings");
  };

  const handleViewMyBookings = () => {
    navigate("/admin/view-bunk-locations");
  };

  const handleViewUsers = () => {
    navigate("/admin/registered-users");
  };

  const handleBookingManagement = () => {
    navigate("/admin/booking-management"); // Add your route path here
  };

  return (
    <div>
      <AdminNavbar/>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={handleAddEvBunk} className="bg-blue-500 text-white p-3 rounded">
            Add New EV Bunk
          </button>
          <button onClick={handleViewEvBunks} className="bg-green-500 text-white p-3 rounded">
            View EV Bunks
          </button>
          <button onClick={handleViewBookingSlots} className="bg-purple-500 text-white p-3 rounded">
            View Booking Slots
          </button>
          <button onClick={handleViewMyBookings} className="bg-yellow-500 text-white p-3 rounded">
            View Bunk locations
          </button>
          <button onClick={handleViewUsers} className="bg-red-500 text-white p-3 rounded">
            View Users
          </button>
          <button onClick={handleBookingManagement} className="bg-indigo-500 text-white p-3 rounded">
            Booking Management
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;