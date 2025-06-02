import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/user/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold">
          <Link to="/user/dashboard">User Panel</Link>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div className="hidden md:flex space-x-6 items-center text-base font-medium">
          <Link to="/user/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/user/book-slot" className="hover:underline">Book Slot</Link>
          <Link to="/user/view-my-bookings" className="hover:underline">View Bookings</Link>
          <Link to="/user/view-bunk-locations" className="hover:underline">View Bunk Locations</Link>
          <Link to="/user/my-profile" className="hover:underline">My Profile</Link>
          <button onClick={handleLogout} className="hover:underline">Logout</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-blue-600 text-white">
          <Link to="/user/dashboard" onClick={toggleMenu} className="block hover:underline">Dashboard</Link>
          <Link to="/user/book-slot" onClick={toggleMenu} className="block hover:underline">Book Slot</Link>
          <Link to="/user/view-my-bookings" onClick={toggleMenu} className="block hover:underline">View Bookings</Link>
          <Link to="/user/view-bunk-locations" onClick={toggleMenu} className="block hover:underline">View Bunk Locations</Link>
          <Link to="/user/my-profile" onClick={toggleMenu} className="block hover:underline">My Profile</Link>
          <button onClick={() => { toggleMenu(); handleLogout(); }} className="block text-left hover:underline">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
