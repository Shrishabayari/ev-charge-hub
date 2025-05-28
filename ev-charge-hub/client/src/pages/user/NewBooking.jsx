// src/pages/user/NewBooking.js
import React from 'react';
import BookingForm from '../../components/user/BookSlot';
import UserNavbar from '../../components/common/navbars/UserNavbar';

const NewBooking = () => {
  
  return (
    <div>
      <UserNavbar/>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Book an EV Charging Slot</h1>
          <p className="text-gray-600 mt-2">
            Select your preferred charging station and time slot
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-1">
          <BookingForm />
        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-blue-800">Booking Tips</h3>
          <ul className="mt-2 space-y-2 text-blue-700">
            <li>• Book at least 24 hours in advance for guaranteed availability</li>
            <li>• Charging sessions are limited to 30 minutes during peak hours</li>
            <li>• You can cancel your booking up to 2 hours before the scheduled time</li>
            <li>• Please arrive on time, as your slot may be given away after 10 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewBooking;