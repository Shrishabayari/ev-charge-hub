// src/pages/user/MyBookings.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserBookings from '../../components/user/MyBookings';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [useMockData, setUseMockData] = useState(false); // Toggle for mock data

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo(null);
        
        // Get the JWT token from localStorage
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token); // Debug log
        
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }
        
        // Option to use mock data for testing UI when API is not working
        if (useMockData) {
          console.log('Using mock data');
          // Simulate API delay
          setTimeout(() => {
            setBookings(MOCK_BOOKINGS);
            setLoading(false);
          }, 500);
          return;
        }
        
        // Make the API request with the token in the Authorization header
        console.log('Fetching bookings from API...');
        const response = await fetch('/api/bookings/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        console.log('Response status:', response.status); // Debug log
        
        // If the response is not ok, try to get more detailed error info
        if (!response.ok) {
          let errorData = {};
          try {
            errorData = await response.json();
          } catch (e) {
            console.error('Error parsing error response:', e);
            errorData = { message: 'Could not parse error response' };
          }
          
          console.error('Error response:', errorData);
          setDebugInfo({
            status: response.status,
            statusText: response.statusText,
            errorDetails: errorData
          });
          
          // Handle specific error codes
          if (response.status === 401) {
            throw new Error('Your session has expired. Please log in again.');
          } else {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
          }
        }

        // Parse the successful response
        const result = await response.json();
        console.log('API response received:', result);
        
        // Handle the nested data structure correctly
        let bookingsData;
        
        // Check if the data is properly structured with success and data fields
        if (result && result.success && Array.isArray(result.data)) {
          bookingsData = result.data;
          console.log('Bookings data extracted from nested structure:', bookingsData.length);
        }
        // Check if it's directly an array
        else if (Array.isArray(result)) {
          bookingsData = result;
          console.log('Bookings data is directly an array:', bookingsData.length);
        }
        // Invalid format
        else {
          console.error('API did not return expected data format:', result);
          setDebugInfo({
            receivedData: result,
            dataType: typeof result
          });
          throw new Error('Invalid data format received from server');
        }
        
        setBookings(bookingsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError(`${err.message}`);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [useMockData]);

  // Function to manually retry fetching
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // This will trigger the useEffect hook to run again
    setUseMockData(useMockData); 
  };

  // Handle booking cancellation at the page level
  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`/api/bookings/cancel/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }
      
      const result = await response.json();
      
      if (result && result.success) {
        // Update the bookings state to reflect cancellation
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status: 'cancelled' } 
              : booking
          )
        );
      } else {
        throw new Error(result.message || 'Failed to cancel booking');
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err.message || 'Failed to cancel booking');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
          <p className="text-gray-600">View and manage your EV charging appointments</p>
          
          {/* Development toggle for mock data */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useMockData}
                  onChange={() => setUseMockData(!useMockData)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-700">Use test data</span>
              </label>
            </div>
          )}
        </div>
        
        <div className="mb-6 flex justify-end">
          <Link 
            to="/user/bookings/new" 
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Book New Slot
          </Link>
        </div>

        {/* Render the UserBookings component with the fetched bookings */}
        {loading ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-red-50 rounded-lg p-6">
            <svg className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-red-600 font-medium text-lg mb-2">Unable to load bookings</p>
            <p className="text-red-700 mb-4">{error}</p>
            
            <button 
              onClick={handleRetry}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Try Again
            </button>
            
            {debugInfo && process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-left text-sm">
                <p className="font-bold mb-2">Debug Information:</p>
                {debugInfo.status && <p><strong>Status:</strong> {debugInfo.status}</p>}
                {debugInfo.statusText && <p><strong>Status Text:</strong> {debugInfo.statusText}</p>}
                {debugInfo.errorDetails && Object.keys(debugInfo.errorDetails).length > 0 && (
                  <div>
                    <p><strong>Error Details:</strong></p>
                    <pre className="bg-gray-800 text-white p-3 rounded overflow-x-auto mt-2">{JSON.stringify(debugInfo.errorDetails, null, 2)}</pre>
                  </div>
                )}
                {debugInfo.receivedData && (
                  <div>
                    <p><strong>Received Data:</strong></p>
                    <pre className="bg-gray-800 text-white p-3 rounded overflow-x-auto mt-2">{JSON.stringify(debugInfo.receivedData, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <UserBookings 
            bookings={bookings} 
            onCancelBooking={handleCancelBooking} 
          />
        )}

        <div className="mt-8 bg-blue-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2 text-blue-800">Booking Policies</h3>
          <ul className="text-blue-700 space-y-2">
            <li>Remember that cancellations less than 2 hours before your appointment may result in a cancellation fee.</li>
            <li>If you need to modify your booking frequently, please consider booking flexible time slots.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Mock data for testing UI
const MOCK_BOOKINGS = [
  {
    _id: 'mock-booking-1',
    bunkId: { 
      _id: 'bunk-1', 
      name: 'EV Charging Station A'
    },
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mock-booking-2',
    bunkId: { 
      _id: 'bunk-2', 
      name: 'EV Charging Station B'
    },
    startTime: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    endTime: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'mock-booking-3',
    bunkId: { 
      _id: 'bunk-3', 
      name: 'EV Charging Station C'
    },
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    endTime: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    status: 'cancelled',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

export default MyBookingsPage;