// src/pages/user/MyBookings.js
import React from 'react';
import { Link } from 'react-router-dom';
import UserBookings from '../../components/user/UserBookings';

const MyBookings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
          <p className="text-gray-600 mt-1">
            View and manage your EV charging appointments
          </p>
        </div>
        
        <Link 
          to="/bookings/new" 
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Book New Slot
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <UserBookings />
      </div>
      
      <div className="mt-8 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <h3 className="text-lg font-medium text-yellow-800">Booking Policies</h3>
        <p className="mt-2 text-yellow-700">
          Remember that cancellations less than 2 hours before your appointment may result in a cancellation fee. 
          If you need to modify your booking frequently, please consider booking flexible time slots.
        </p>
      </div>
    </div>
  );
};

export default MyBookings;