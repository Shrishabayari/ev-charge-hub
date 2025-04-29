import { useEffect, useState } from "react";
import axios from "axios";

const MyBookingsPage = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newSlotTime, setNewSlotTime] = useState("");

  // Fetch user's bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`/api/bookings/${userId}`);
      setBookings(res.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Cancel a booking
  const handleCancel = async (id) => {
    try {
      await axios.put(`/api/bookings/cancel/${id}`);
      fetchBookings();
    } catch (error) {
      console.error("Error cancelling", error);
    }
  };

  // Reschedule a booking
  const handleReschedule = async () => {
    if (!newSlotTime || !rescheduleId) return;
    try {
      await axios.put(`/api/bookings/reschedule/${rescheduleId}`, {
        newSlotTime,
      });
      setRescheduleId(null);
      setNewSlotTime("");
      fetchBookings();
    } catch (error) {
      console.error("Error rescheduling", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        My Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No bookings yet.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="border border-gray-300 dark:border-gray-600 p-4 rounded mb-4"
          >
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Slot:</strong> {new Date(booking.slotTime).toLocaleString()}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Status:</strong> {booking.status}
            </p>

            {booking.status === "booked" && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleCancel(booking._id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={() => setRescheduleId(booking._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                >
                  Reschedule
                </button>
              </div>
            )}

            {rescheduleId === booking._id && (
              <div className="mt-3">
                <input
                  type="datetime-local"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="border p-2 rounded mr-2"
                />
                <button
                  onClick={handleReschedule}
                  className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookingsPage;
