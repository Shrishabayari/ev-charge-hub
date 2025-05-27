import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          EV Charge Hub
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center text-gray-700 font-medium">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/how-it-works">How It Works</Link></li>
          <li><Link to="/faq">FAQ</Link></li>

          {/* Login Dropdown */}
          <li className="relative group">
            <span className="cursor-pointer">Login</span>
            <ul className="absolute left-0 mt-2 w-32 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <li>
                <Link to="/admin/login" className="block px-4 py-2 hover:bg-gray-100">Admin</Link>
              </li>
              <li>
                <Link to="/user/login" className="block px-4 py-2 hover:bg-gray-100">User</Link>
              </li>
            </ul>
          </li>
        </ul>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden mt-3 space-y-2 bg-white border-t pt-3 text-gray-700 font-medium">
          <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
          <li><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
          <li><Link to="/how-it-works" onClick={toggleMenu}>How It Works</Link></li>
          <li><Link to="/faq" onClick={toggleMenu}>FAQ</Link></li>
          <li>
            <div className="pl-4 text-sm text-gray-600">Login</div>
            <ul className="pl-6 space-y-1">
              <li><Link to="/login/admin" onClick={toggleMenu}>Admin</Link></li>
              <li><Link to="/login/user" onClick={toggleMenu}>User</Link></li>
            </ul>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
