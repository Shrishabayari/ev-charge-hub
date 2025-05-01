import { useState } from 'react';

export default function BookSlot() {
  const [slotTime, setSlotTime] = useState('');
  const [location, setLocation] = useState('');

  const handleBooking = (e) => {
    e.preventDefault();
    // TODO: Send booking to backend
    alert(`Slot booked at ${location} on ${slotTime}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Book Recharge Slot</h2>
        <form onSubmit={handleBooking} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
          <input
            type="datetime-local"
            value={slotTime}
            onChange={(e) => setSlotTime(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}
