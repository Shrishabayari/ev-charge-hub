import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">EV Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `hover:text-yellow-400 ${isActive ? 'text-yellow-400 font-semibold' : ''}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/manage-bunks"
            className={({ isActive }) =>
              `hover:text-yellow-400 ${isActive ? 'text-yellow-400 font-semibold' : ''}`
            }
          >
            Manage Bunks
          </NavLink>
          <NavLink
            to="/admin/manage-slots"
            className={({ isActive }) =>
              `hover:text-yellow-400 ${isActive ? 'text-yellow-400 font-semibold' : ''}`
            }
          >
            Manage Slots
          </NavLink>
          <NavLink
            to="/admin/logout"
            className="hover:text-red-400 text-red-300"
          >
            Logout
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
