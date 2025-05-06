import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import AdminBookingsComponent from '../../components/admin/BookingManagement';
import { Helmet } from 'react-helmet-async';

/**
 * Admin Bookings Page
 * 
 * This page serves as a container for the BookingManagement component,
 * wrapped in the admin layout for consistent admin UI.
 */
const AdminBookingsPage = () => {
  return (
    <AdminLayout>
      <Helmet>
        <title>Booking Management | Bunk Admin</title>
        <meta name="description" content="Manage all bookings for Bunk properties" />
      </Helmet>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Booking Management</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
          {/* Main content */}
          <AdminBookingsComponent />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookingsPage;