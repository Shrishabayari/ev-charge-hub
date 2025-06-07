// src/pages/user/MyBookings.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserBookings from '../../components/user/MyBookings';
import UserNavbar from '../../components/common/navbars/UserNavbar';
import Footer from "../../components/common/Footer";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

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
  }, []);

  // Function to manually retry fetching
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Force a re-fetch by updating a state that triggers useEffect
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        setDebugInfo(null);
        
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }
        
        const response = await fetch('/api/bookings/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          let errorData = {};
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { message: 'Could not parse error response' };
          }
          
          setDebugInfo({
            status: response.status,
            statusText: response.statusText,
            errorDetails: errorData
          });
          
          if (response.status === 401) {
            throw new Error('Your session has expired. Please log in again.');
          } else {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
          }
        }

        const result = await response.json();
        let bookingsData;
        
        if (result && result.success && Array.isArray(result.data)) {
          bookingsData = result.data;
        } else if (Array.isArray(result)) {
          bookingsData = result;
        } else {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <UserNavbar/>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v7a2 2 0 002 2h4a2 2 0 002-2v-7m-6 0a2 2 0 012-2h4a2 2 0 012 2"/>
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    My Bookings
                  </h1>
                </div>
                <p className="text-gray-600 text-lg">Manage your EV charging appointments with ease</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Link 
                  to="/user/book-slot" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Book New Slot
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          {loading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                  <svg className="animate-spin w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Bookings</h3>
                <p className="text-gray-600">Please wait while we fetch your booking information...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Unable to Load Bookings</h3>
                <p className="text-red-600 mb-6">{error}</p>
                
                {/* Debug information for development */}
                {debugInfo && process.env.NODE_ENV === 'development' && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                    <h4 className="font-semibold text-gray-900 mb-2">Debug Information:</h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </div>
                )}
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Try Again
                  </button>
                  <Link
                    to="/user/dashboard"
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <UserBookings 
              bookings={bookings} 
              onCancelBooking={handleCancelBooking}
            />
          )}
        </div>

        {/* Additional Info Section */}
        {!loading && !error && bookings.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v7a2 2 0 002 2h4a2 2 0 002-2v-7m-6 0a2 2 0 012-2h4a2 2 0 012 2"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No Bookings Found</h3>
              <p className="text-gray-600 mb-6">You don't have any booking appointments yet. Start by booking your first EV charging slot!</p>
              
              <Link 
                to="/user/book-slot" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                Book Your First Slot
              </Link>
            </div>
          </div>
        )}
      </div><Footer/>
    </div>
  );
};

export default MyBookingsPage;