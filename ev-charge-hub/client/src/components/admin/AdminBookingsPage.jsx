import { useEffect, useState } from "react";
import axios from "axios";

const AdminBookingsPage = ({ bunkId }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`/api/bookings/bunk/${bunkId}`);
        setBookings(res.data.bookings);
      } catch (error) {
        console.error("Failed to load bunk bookings", error);
      }
    };

    fetchBookings();
  }, [bunkId]);

  return (
    <div className="p-6 max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        All Bookings for this Bunk
      </h2>

      {bookings.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="border border-gray-300 dark:border-gray-600 p-4 rounded mb-4"
          >
            <p className="text-gray-800 dark:text-gray-200">
              <strong>User:</strong> {booking.userId?.name || "Unknown"}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Slot:</strong> {new Date(booking.slotTime).toLocaleString()}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Status:</strong> {booking.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminBookingsPage;
