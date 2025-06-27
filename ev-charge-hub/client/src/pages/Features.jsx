import React from 'react';
import Navbar from '../components/common/navbars/Navbar'; // Assuming you want a Navbar on this page

const Features = () => {
  return (
    <>
      <Navbar />
      <section id="features" className="py-24 px-6 md:px-12 lg:px-24 bg-white ">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900  mb-8 animate-fade-in-down">Unlock the Power of Seamless EV Charging</h2>
          <p className="text-lg md:text-xl text-gray-600  max-w-3xl mx-auto animate-fade-in-down delay-100">Effortless EV Charging: Experience Tomorrow's Convenience Today with Intelligent Slot Reservations and an Expansive Network.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {/* Feature 1 */}
          <div className="p-10 bg-gray-50  rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100  group animate-fade-in-up">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900  mb-4">Extensive Network in Karnataka</h3>
            <p className="text-gray-700  leading-relaxed">Discover a growing network of EV charging stations across Mudbidri and all major locations in Karnataka, ensuring you're always connected.</p>
          </div>

          {/* Feature 2 */}
          <div className="p-10 bg-gray-50  rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100  group animate-fade-in-up delay-100">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 ">Real-Time Availability & Booking</h3>
            <p className="text-gray-700  leading-relaxed">Check live availability of charging slots and book your preferred time in advance to avoid waiting, ensuring a smooth charging experience.</p>
          </div>

          {/* Feature 3 */}
          <div className="p-10 bg-gray-50  rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100  group animate-fade-in-up delay-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900  mb-4">Intuitive User & Admin Panels</h3>
            <p className="text-gray-700  leading-relaxed">Dedicated, user-friendly dashboards for EV owners to manage bookings and for station administrators to oversee the network efficiently.</p>
          </div>

          {/* Feature 4 */}
          <div className="p-10 bg-gray-50  rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group animate-fade-in-up delay-400">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900  mb-4">Smart Charge Management</h3>
            <p className="text-gray-700  leading-relaxed">Optimize your charging sessions with smart features, monitor energy usage in real-time, and track your complete charging history for insights.</p>
          </div>
          
          {/* Feature 5 - Note: original HTML used bg-white for some cards, changed to bg-gray-50 for consistency or keep if intentional */}
          <div className="p-10 bg-gray-50  rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100  group animate-fade-in-up">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-lime-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900  mb-4">Guaranteed Charging Slots</h3>
            <p className="text-gray-700  leading-relaxed">Book your preferred charging slot in advance, eliminating waiting times and range anxiety across Karnataka, including **Mudbidri**.</p>
          </div>
          
          {/* Feature 6 */}
          <div className="p-10 bg-gray-50  rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100  group animate-fade-in-up delay-200">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9m-9 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m11.95 9.95l-1.414 1.414M10.05 10.05l-1.414-1.414M11.95 10.05l1.414 1.414M10.05 11.95l1.414 1.414"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900  mb-4">Optimized Charging Experience</h3>
            <p className="text-gray-700  leading-relaxed">Intelligent booking systems help distribute demand, preventing congestion at popular charging points and ensuring a smooth experience.</p>
          </div>

          {/* Feature 7 */}
          <div className="p-10 bg-gray-50  rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100  group animate-fade-in-up delay-300">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 12c0 3.072 1.22 5.852 3.14 7.954L12 22.95l5.94-5.046A12.004 12.004 0 0021.08 12c0-3.072-1.22-5.852-3.14-7.954z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900  mb-4">Efficient Route Planning</h3>
            <p className="text-gray-700  leading-relaxed">Integrate charging stops seamlessly into your travel plans across Karnataka, ensuring smooth and uninterrupted long-distance journeys.</p>
          </div>

          {/* Feature 8 */}
          <div className="p-10 bg-gray-50  rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100  group animate-fade-in-up delay-400">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900  mb-4">Diverse Charger Types & Speeds</h3>
            <p className="text-gray-700  leading-relaxed">Find a variety of charging options, from rapid DC chargers for quick top-ups to AC chargers for overnight power, catering to all EV models.</p>
          </div>

          {/* Feature 9 */}
          <div className="p-10 bg-gray-50  rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100  group animate-fade-in-up delay-500">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900  mb-4">Enhanced Charging Network</h3>
            <p className="text-gray-700  leading-relaxed">Benefit from Karnataka's continuously expanding EV charging infrastructure, with thousands of stations across the state, making charging accessible everywhere.</p>
          </div>

          {/* Feature 10 */}
          <div className="p-10 bg-gray-50  rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100  group animate-fade-in-up delay-600">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900  mb-4">Time Tracking</h3>
            <p className="text-gray-700  leading-relaxed">Monitor your charging sessions and energy consumption directly through the app, helping you manage your EV expenses effectively.</p>
          </div>

          {/* Feature 11 */}
          <div className="p-10 bg-gray-50  rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100  group animate-fade-in-up delay-700">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9a2 2 0 00-2-2h-7a2 2 0 00-2 2v10a2 2 0 002 2zM9 19H7a2 2 0 01-2-2V7a2 2 0 012-2h2"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900  mb-4">User-Friendly Mobile Apps</h3>
            <p className="text-gray-700  leading-relaxed">Access intuitive and easy-to-use mobile applications for finding, booking, and managing your EV charging sessions.</p>
          </div>

          {/* Feature 12 */}
          <div className="p-10 bg-gray-50  rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100  group animate-fade-in-up delay-500">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l-2 5m2-5l-2-5m-2 5l4-9"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900  mb-4">Eco-Friendly Initiative</h3>
            <p className="text-gray-700  leading-relaxed">Join our community committed to sustainable transportation, reduce your carbon footprint, and contribute to a cleaner environment in Karnataka.</p>
          </div>
        </div>
      </section>
      <footer className="bg-gray-800  text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-4 text-blue-400">EV Charge Hub</h3>
                <p className="text-gray-400">Your ultimate partner for seamless EV charging in India.</p>
            </div>
            <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-1 text-blue-400">Quick Links</h3>
                <ul className="space-y">
                      <li><a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">Home</a></li>
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
    </>
  );
};

export default Features;