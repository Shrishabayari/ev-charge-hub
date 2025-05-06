import React, { useState, useEffect } from 'react';
import { getAllBookings, getBookingsByBunk } from '../../services/BookingService';
import { getAllBunks } from '../../services/BunkService';

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
        setError("Failed to load bunks");
      }
    };

    fetchBunks();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        let data;
        if (selectedBunk) {
          data = await getBookingsByBunk(selectedBunk);
        } else {
          data = await getAllBookings();
        }
        setBookings(data.bookings);
        setError('');
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings");
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
    switch(status) {
      case 'booked': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Bunk
            </label>
            <select
              value={selectedBunk}
              onChange={(e) => setSelectedBunk(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Bunks</option>
              {bunks.map(bunk => (
                <option key={bunk._id} value={bunk._id}>
                  {bunk.name} - {bunk.location}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Statuses</option>
              <option value="booked">Booked</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12">Loading bookings...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No bookings found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bunk Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slot Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booked On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.userId?.name || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.userId?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.bunkId?.name || 'Unknown Bunk'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.bunkId?.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(booking.slotTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => window.location.href = `/admin/bookings/${booking._id}`}
                        >
                          View
                        </button>
                        {booking.status === 'booked' && (
                          <>
                            <button
                              className="text-yellow-600 hover:text-yellow-900"
                              onClick={() => window.location.href = `/admin/bookings/${booking._id}/edit`}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to cancel this booking?')) {
                                  // Handle cancel logic here
                                  console.log('Cancel booking:', booking._id);
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

      {/* Summary Stats */}
      {!loading && !error && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-medium text-blue-800">Total Bookings</h3>
            <p className="text-3xl font-bold text-blue-900">{filteredBookings.length}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-medium text-green-800">Active Bookings</h3>
            <p className="text-3xl font-bold text-green-900">
              {filteredBookings.filter(b => b.status === 'booked').length}
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="text-lg font-medium text-red-800">Cancelled</h3>
            <p className="text-3xl font-bold text-red-900">
              {filteredBookings.filter(b => b.status === 'cancelled').length}
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-medium text-yellow-800">Rescheduled</h3>
            <p className="text-3xl font-bold text-yellow-900">
              {filteredBookings.filter(b => b.status === 'rescheduled').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;