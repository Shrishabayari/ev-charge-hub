import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingForm = () => {
  const [bunks, setBunks] = useState([]);
  const [selectedBunk, setSelectedBunk] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch available bunks
    axios.get("/api/bunks").then(res => setBunks(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/bookings", {
        bunkId: selectedBunk,
        slotTime,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMessage("Slot booked successfully!");
    } catch (err) {
      setMessage("Booking failed.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Book Recharge Slot</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={selectedBunk}
          onChange={(e) => setSelectedBunk(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select EV Bunk</option>
          {bunks.map(bunk => (
            <option key={bunk._id} value={bunk._id}>
              {bunk.name} - {bunk.location}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={slotTime}
          onChange={(e) => setSlotTime(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Book Slot
        </button>

        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default BookingForm;
