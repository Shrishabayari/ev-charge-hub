import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/">EV Charge Hub</Link>
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center font-medium">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/how-it-works" className="hover:underline">How It Works</Link>
          <Link to="/faq" className="hover:underline">FAQ</Link>
          <Link to="/why-ev-charge-hub" className="hover:underline">Why Ev Charge Hub</Link>
          <Link to="/contact" onClick={toggleMenu} className="block hover:underline">Contact</Link>
          <div className="relative group cursor-pointer">
            <span className="hover:underline">Login</span>
            <div className="absolute left-0 mt-2 w-32 bg-white text-black rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
              <Link to="/admin/register" className="block px-4 py-2 hover:bg-gray-100">Admin</Link>
              <Link to="/user/register" className="block px-4 py-2 hover:bg-gray-100">User</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-blue-600 text-white font-medium">
          <Link to="/" onClick={toggleMenu} className="block hover:underline">Home</Link>
          <Link to="/about" onClick={toggleMenu} className="block hover:underline">About</Link>
          <Link to="/how-it-works" onClick={toggleMenu} className="block hover:underline">How It Works</Link>
          <Link to="/faq" onClick={toggleMenu} className="block hover:underline">FAQ</Link>
          <Link to="/contact" onClick={toggleMenu} className="block hover:underline">Contact</Link>
          <div className="pt-2">
            <span className="block text-sm text-gray-200">Login</span>
            <div className="pl-4">
              <Link to="/admin/login" onClick={toggleMenu} className="block hover:underline">Admin</Link>
              <Link to="/user/login" onClick={toggleMenu} className="block hover:underline">User</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
