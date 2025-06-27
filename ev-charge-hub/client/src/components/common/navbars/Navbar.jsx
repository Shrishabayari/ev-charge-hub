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
          <Link to="/contact"  className="block hover:underline">Contact</Link>
          <Link to="/user/login" className="hover:underline">Sign In</Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-blue-600 text-white font-medium">
          <Link to="/" onClick={toggleMenu} className="block hover:underline">Home</Link>
          <Link to="/about" onClick={toggleMenu} className="block hover:underline">About</Link>
          <Link to="/how-it-works" onClick={toggleMenu} className="block hover:underline">How It Works</Link>
          <Link to="/why-ev-charge-hub" onClick={toggleMenu} className="block hover:underline">Why Ev Charge Hub</Link>
          <Link to="/faq" onClick={toggleMenu} className="block hover:underline">FAQ</Link>
          <Link to="/contact" onClick={toggleMenu} className="block hover:underline">Contact</Link>
          <Link to="/user/login" onClick={toggleMenu} className="hover:underline">Sign In</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
