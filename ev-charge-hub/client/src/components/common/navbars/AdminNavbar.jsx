import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold">
          <Link to="/admin/dashboard">Admin Panel</Link>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/admin/add-bunk" className="hover:underline">Add Bunk</Link>
          <Link to="/admin/view-bunks" className="hover:underline">View Bunks</Link>
          <Link to="/admin/view-bookings" className="hover:underline">View Bookings</Link>
          <Link to="/admin/view-bunk-locations" className="hover:underline">View Locations</Link>
          <Link to="/admin/registered-users" className="hover:underline">View Users</Link>
          <button onClick={handleLogout} className="hover:underline text-red-100">Logout</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-blue-600 text-white">
          <Link to="/admin/dashboard" onClick={toggleMenu} className="block hover:underline">Dashboard</Link>
          <Link to="/admin/add-bunk" onClick={toggleMenu} className="block hover:underline">Add Bunk</Link>
          <Link to="/admin/view-bunks" onClick={toggleMenu} className="block hover:underline">View Bunks</Link>
          <Link to="/admin/view-bookings" onClick={toggleMenu} className="block hover:underline">View Bookings</Link>
          <Link to="/admin/view-bunk-locations" onClick={toggleMenu} className="block hover:underline">View Locations</Link>
          <button onClick={() => { toggleMenu(); handleLogout(); }} className="block text-left hover:underline text-red-100">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
