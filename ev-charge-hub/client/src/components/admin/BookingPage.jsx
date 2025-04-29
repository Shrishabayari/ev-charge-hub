import { useState } from "react";
import axios from "axios";

const BookingPage = ({ userId, bunkId }) => {
  const [slotTime, setSlotTime] = useState("");

  const handleBooking = async () => {
    if (!slotTime) {
      alert("Please select a slot time.");
      return;
    }
  
    try {
      // Step 1: Check slot availability
      const availabilityRes = await axios.post("/api/bookings/check-availability", {
        bunkId,
        slotTime,
      });
  
      if (!availabilityRes.data.available) {
        alert("This slot is already booked. Please select a different time.");
        return;
      }
  
      // Step 2: Proceed with booking
      const bookingRes = await axios.post("/api/bookings/create", {
        userId,
        bunkId,
        slotTime,
      });
  
      alert("Booking successful!");
      console.log(bookingRes.data.booking);
      setSlotTime(""); // Reset input
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to book slot.");
    }
  };
  

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Book a Recharge Slot</h2>

      <label className="block text-gray-700 dark:text-gray-200 mb-2">Select Date & Time:</label>
      <input
        type="datetime-local"
        value={slotTime}
        onChange={(e) => setSlotTime(e.target.value)}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4"
      />

      <button
        onClick={handleBooking}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Book Now
      </button>
    </div>
  );
};

export default BookingPage;
