import React, { useState, useEffect } from "react";
import axios from "axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [newSlot, setNewSlot] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/bookings/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    try {
      await axios.patch(`/api/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const rescheduleBooking = async (id) => {
    try {
      await axios.patch(`/api/bookings/${id}/reschedule`, {
        slotTime: newSlot,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNewSlot("");
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
      {bookings.map((booking) => (
        <div key={booking._id} className="border-b py-4 space-y-2">
          <p><strong>Bunk:</strong> {booking.bunkId?.name}</p>
          <p><strong>Time:</strong> {new Date(booking.slotTime).toLocaleString()}</p>
          <p><strong>Status:</strong> {booking.status}</p>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => cancelBooking(booking._id)}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Cancel
            </button>

            <input
              type="datetime-local"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <button
              onClick={() => rescheduleBooking(booking._id)}
              className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
            >
              Reschedule
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
