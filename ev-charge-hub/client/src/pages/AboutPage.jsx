import React from "react";
import Navbar from "../components/common/navbars/Navbar";

const About = () => {
  return (
    <div>
      <Navbar />
      <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Introduction */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold mb-4 text-blue-700 dark:text-blue-400">
              About EV Recharge Hub
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Connecting you to the future of sustainable electric vehicle charging.
            </p>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <p className="mb-12 text-lg md:text-xl leading-relaxed text-center max-w-4xl mx-auto">
            <strong className="text-blue-600 dark:text-blue-300">EV Recharge Hub</strong> is an innovative platform designed to streamline the electric vehicle (EV) charging experience for users and administrators alike. Our mission is to empower the future of mobility by connecting EV drivers with accessible, reliable, and smart charging stations.
          </p>

          {/* Card-Based Sections */}
          <div className="grid md:grid-cols-2 gap-10 mt-10">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Why EV Recharge Hub?</h2>
              <ul className="list-disc ml-6 space-y-3 text-base text-gray-700 dark:text-gray-200">
                <li>Locate nearby EV charging stations with ease.</li>
                <li>Book and manage charging slots in real-time.</li>
                <li>Get detailed bunk info including address, map, and available slots.</li>
                <li>Admin tools to add, manage, and monitor EV recharge bunks.</li>
                <li>Modern interface with responsive and dark mode support.</li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Our Vision</h2>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-200">
                At EV Recharge Hub, we believe the future of transportation is electric. We're committed to supporting the transition to sustainable energy by building a platform that is simple, efficient, and accessible for everyone—from EV owners to recharge station operators.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-800 dark:bg-gray-950 text-white py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4 text-blue-400">EV Charge Hub</h3>
                  <p className="text-gray-400">Your ultimate partner for seamless EV charging in India.</p>
              </div>
              <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-1 text-blue-400">Quick Links</h3>
                  <ul className="space-y">
                      <li><a href="/home" className="text-gray-300 hover:text-white transition-colors duration-200">Home</a></li>
                      <li><a href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</a></li>
                      <li><a href="/how-it-works" className="text-gray-300 hover:text-white transition-colors duration-200">How It Works</a></li>
                      <li><a href="/why-ev-charge-hub" className="text-gray-300 hover:text-white transition-colors duration-200">Features</a></li>
                      <li><a href="/faq" className="text-gray-300 hover:text-white transition-colors duration-200">FAQ</a></li>
                      <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a></li>
                  </ul>
              </div>
              <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4 text-blue-400">Contact Info</h3>
                  <p className="text-gray-400 mb-2">Email: <a href="mailto:support@evchargehub.com" className="hover:underline">support@evchargehub.com</a></p>
                  <p className="text-gray-400 mb-2">Phone: <a href="tel:+917348941111" className="hover:underline">+91-9876543210</a></p>
                  <p className="text-gray-400">Location: Udupi, Karnataka, India</p>
                  <p className="text-gray-500 text-sm mt-6">&copy; {new Date().getFullYear()} EV Charge Hub. All rights reserved.</p>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default About;