import { useEffect, useState } from 'react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // TODO: Fetch bookings from backend API
    // Example static data:
    const sampleBookings = [
      { id: 1, location: 'Station A', time: '2025-05-03T10:00' },
      { id: 2, location: 'Station B', time: '2025-05-04T14:30' },
    ];
    setBookings(sampleBookings);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No bookings found.</p>
        ) : (
          <ul className="space-y-3">
            {bookings.map((booking) => (
              <li key={booking.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  <strong>Location:</strong> {booking.location}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Time:</strong> {new Date(booking.time).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
