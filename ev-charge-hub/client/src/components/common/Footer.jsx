import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router-dom for navigation

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white py-2 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        {/* Logo/Brand Name */}
        <div className="mb-4 md:mb-0">
          <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-300">
            EVChargeHub
          </Link>
          <p className="text-sm text-gray-400 mt-2">Connecting you to the future of EV charging.</p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 mb-4 md:mb-0">
          <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300 text-md">
            Contact
          </Link>
        </div>
        {/* Copyright */}
        <div className="text-sm text-gray-400">
          &copy; {currentYear} EVRechargeHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;