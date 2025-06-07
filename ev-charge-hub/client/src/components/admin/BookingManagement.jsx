import React, { useState, useEffect } from 'react';
import { getAllBookings, getBookingsByBunk } from '../../services/BookingService';
import { getAllBunks } from '../../services/BunkService';
import Footer from "../common/Footer";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [bunks, setBunks] = useState([]);
  const [selectedBunk, setSelectedBunk] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBunks = async () => {
      try {
        const res = await getAllBunks();
        setBunks(res.bunks);
      } catch (err) {
        console.error("Error fetching bunks:", err);
        setError("Failed to load bunks for filtering.");
      }
    };

    fetchBunks();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(''); // Clear previous errors
      try {
        let data;
        if (selectedBunk) {
          data = await getBookingsByBunk(selectedBunk);
        } else {
          data = await getAllBookings();
        }
        setBookings(data.bookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedBunk]);

  // Filter bookings based on date and status
  const filteredBookings = bookings.filter(booking => {
    const matchesDate = dateFilter
      ? booking.slotTime.startsWith(dateFilter)
      : true;

    const matchesStatus = statusFilter
      ? booking.status === statusFilter
      : true;

    return matchesDate && matchesStatus;
  });

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'booked': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center sm:text-left">
          Booking Management
        </h1>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="bunk-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by EV Bunk
              </label>
              <select
                id="bunk-filter"
                value={selectedBunk}
                onChange={(e) => setSelectedBunk(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Bunks</option>
                {bunks.map(bunk => (
                  <option key={bunk._id} value={bunk._id}>
                    {bunk.name} - {bunk.address.split(',')[0]} {/* Displaying first part of address */}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Date
              </label>
              <input
                id="date-filter"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                <option value="booked">Booked</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-xl font-medium text-gray-600">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div>
              Loading bookings...
            </div>
          ) : error ? (
            <div className="text-center py-16 text-xl text-red-600 font-medium">
              <p>{error}</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-16 text-xl text-gray-500 font-medium">
              No bookings found for the selected criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      EV Bunk
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Slot Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Booked On
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-0"> {/* Removed ml-4 as it wasn't providing value without an image */}
                            <div className="text-sm font-medium text-gray-900">
                              {booking.userId?.name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.userId?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.bunkId?.name || 'Unknown Bunk'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.bunkId?.address || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDateTime(booking.slotTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(booking.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 font-medium transition-colors duration-150"
                            onClick={() => window.location.href = `/admin/bookings/${booking._id}`}
                          >
                            View
                          </button>
                          {booking.status === 'booked' && (
                            <>
                              <button
                                className="text-yellow-600 hover:text-yellow-900 font-medium transition-colors duration-150"
                                onClick={() => window.location.href = `/admin/bookings/${booking._id}/edit`}
                              >
                                Edit
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900 font-medium transition-colors duration-150"
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to cancel this booking?')) {
                                    // Placeholder for actual cancel logic
                                    console.log('Cancel booking:', booking._id);
                                    // You would typically call an API here to update the booking status
                                    // e.g., cancelBooking(booking._id).then(fetchBookings);
                                  }
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Summary Stats Section */}
        {!loading && !error && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-100 p-6 rounded-xl border border-blue-200 shadow-md flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium text-blue-800 mb-1">Total Bookings</h3>
                <p className="text-4xl font-bold text-blue-900">{filteredBookings.length}</p>
              </div>

              <div className="bg-green-100 p-6 rounded-xl border border-green-200 shadow-md flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium text-green-800 mb-1">Active Bookings</h3>
                <p className="text-4xl font-bold text-green-900">
                  {filteredBookings.filter(b => b.status === 'booked').length}
                </p>
              </div>

              <div className="bg-red-100 p-6 rounded-xl border border-red-200 shadow-md flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium text-red-800 mb-1">Cancelled</h3>
                <p className="text-4xl font-bold text-red-900">
                  {filteredBookings.filter(b => b.status === 'cancelled').length}
                </p>
              </div>

              <div className="bg-yellow-100 p-6 rounded-xl border border-yellow-200 shadow-md flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium text-yellow-800 mb-1">Rescheduled</h3>
                <p className="text-4xl font-bold text-yellow-900">
                  {filteredBookings.filter(b => b.status === 'rescheduled').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div><Footer/>
    </div>
  );
};

export default BookingManagement;