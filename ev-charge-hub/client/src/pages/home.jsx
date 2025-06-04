import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/navbars/Navbar"; // Ensure this path is correct

// --- Data for FAQ Section (from your previous FAQ component) ---
const faqData = [
  {
    question: "What is EV Recharge Hub?",
    answer:
      "EV Recharge Hub is an electric vehicle recharge management platform that allows users to locate, book, and recharge at EV stations easily and efficiently.",
  },
  {
    question: "How do I find the nearest recharge bunk?",
    answer:
      "After logging in, you can use the map and search functionality to view nearby EV recharge stations based on your location.",
  },
  {
    question: "Can I cancel or reschedule a booking?",
    answer:
      "Yes, you can cancel or reschedule your booking from your dashboard under the 'My Bookings' section before the scheduled slot time.",
  },
  {
    question: "Is the booking service free?",
    answer:
      "Yes, booking a slot on EV Recharge Hub is free. However, actual recharge cost may vary based on the station and slot duration.",
  },
  {
    question: "How can I become an admin or register my recharge station?",
    answer:
      "If you own an EV recharge station, you can register as an admin through the 'Admin Login' section and manage your bunk and available slots.",
  },
  {
    question: "Do I need an account to book a recharge slot?",
    answer:
      "Yes, users need to register and log in to access the booking features and manage their bookings securely.",
  },
  {
    question: "Can I see real-time slot availability?",
    answer:
      "Yes, the system shows real-time availability of slots for each recharge station so you can plan accordingly.",
  },
  {
    question: "What happens if I miss my booked slot?",
    answer:
      "If a user does not check-in during their scheduled time, the slot may be marked as missed and can be released for others.",
  },
  {
    question: "How do I contact support if I face issues?",
    answer:
      "You can reach our support team via the 'Contact Us' section available in the website footer or from your dashboard.",
  },
  {
    question: "Is EV Recharge Hub available across India?",
    answer:
      "Currently, EV Recharge Hub is expanding across major cities in India. You can check the availability of recharge bunks in your area via the platform.",
  },
  {
    question: "How long does a typical EV recharge take?",
    answer:
      "Recharge times vary based on your vehicle and the charging station. Typically, a full charge can take anywhere from 30 minutes to a few hours.",
  },
  {
    question: "What types of vehicles are supported?",
    answer:
      "Our platform supports all types of electric vehicles, including two-wheelers, three-wheelers, and four-wheelers.",
  },
  {
    question: "Are there any penalties for late check-ins?",
    answer:
      "Repeated late check-ins without notice may lead to temporary suspension of booking privileges to ensure fairness for other users.",
  },
  {
    question: "Can I view my booking history?",
    answer:
      "Yes, you can view all past and current bookings in your dashboard under the 'My Bookings' section.",
  },
  {
    question: "Is the EV Recharge Hub mobile-friendly?",
    answer:
      "Absolutely. The platform is fully responsive and works smoothly on all devices including smartphones and tablets.",
  },
  {
    question: "How often is station data updated?",
    answer:
      "Station data including availability and location is updated in real time by station admins and system sensors.",
  },
  {
    question: "Do I need to bring anything for verification?",
    answer:
      "Most stations verify your booking using your phone number or booking ID. Some may request additional verification like your vehicle number.",
  },
  {
    question: "Can I use the service without GPS?",
    answer:
      "While GPS helps to automatically detect nearby stations, you can manually search by location if GPS access is disabled.",
  }
];

// --- Data for How It Works Section (from your previous HowItWorks component) ---
const steps = [
  {
    title: "Sign Up or Login",
    description: "Create an account or log in as a user or admin to access recharge features and manage EV bunks.",
    icon: "🔐",
  },
  {
    title: "Complete Profile Setup",
    description: "Update your vehicle details, preferred locations, and contact info to personalize your experience.",
    icon: "📝",
  },
  {
    title: "Locate Nearby Recharge Bunks",
    description: "Use the map or search bar to find EV recharge stations near your location with real-time availability.",
    icon: "📍",
  },
  {
    title: "Check Availability",
    description: "See live slot status, capacity, and details of each recharge station including location on map.",
    icon: "🕒",
  },
  {
    title: "Book a Slot",
    description: "Reserve a slot in advance to secure your recharge without waiting in queues.",
    icon: "📅",
  },
  {
    title: "Track Bookings & History",
    description: "Easily view, manage, cancel, or reschedule your recharge bookings from your dashboard.",
    icon: "📊",
  },
  {
    title: "Check-in & Recharge",
    description: "Visit the bunk at your booked time, check in with your booking ID, and recharge your EV.",
    icon: "⚡",
  },
  {
    title: "Get Help if Needed",
    description: "Use the in-app support or contact section if you need assistance with bookings or usage.",
    icon: "📞",
  },
];


const Home = () => {
  // State for Contact Form
  const [contactFormData, setContactFormData] = useState({ name: "", email: "", message: "" });
  const [contactMessage, setContactMessage] = useState("");
  const [contactError, setContactError] = useState("");

  const handleContactChange = (e) => {
    setContactFormData({ ...contactFormData, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactMessage("");
    setContactError("");

    // Basic validation
    if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
      setContactError("Please fill in all fields.");
      return;
    }

    // Simulate API call
    console.log("Submitted contact form:", contactFormData);
    setContactMessage("Thank you for contacting us! We will get back to you soon.");
    setContactFormData({ name: "", email: "", message: "" });

    // Clear message after a few seconds
    setTimeout(() => {
      setContactMessage("");
      setContactError("");
    }, 5000);
  };

  // State for FAQ Accordion
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <Navbar />
      <main className="dark:bg-gray-900 dark:text-white text-gray-800 font-inter">

        {/* Hero Section - Updated with user's provided content */}
        <section id="hero" className="bg-gradient-to-r from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-700 py-20 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Power Your Journey with <span className="text-blue-600 dark:text-blue-400">EV Charge Hub</span>
              </h1>
              <p className="text-lg md:text-xl mb-6">
                Locate, Book, and Recharge at your nearest EV Station. Easy. Fast. Smart.
              </p>
              <div className="flex gap-4">
                <Link to="/login/user" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                  Get Started
                </Link>
                <Link to="/how-it-works" className="border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100 dark:hover:bg-gray-800 transition">
                  How It Works
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <img
                src="https://img.freepik.com/free-vector/electric-car-concept-illustration_114360-8227.jpg"
                alt="EV Charging"
                className="rounded-xl shadow-xl w-full"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/E0E7FF/3F51B5?text=EV+Charging" }} // Added fallback
              />
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-20 px-6 md:px-12 lg:px-24 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Unlock the Power of Seamless EV Charging</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Experience the future of EV charging with these key features, designed to make your journey effortless and efficient.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Feature 1 */}
            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 border border-gray-100 dark:border-gray-600">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Extensive Network in Karnataka</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Discover a growing network of EV charging stations across Mudbidri and all major locations in Karnataka, ensuring you're always connected.</p>
            </div>
            {/* Feature 2 */}
            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 border border-gray-100 dark:border-gray-600">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Real-Time Availability & Booking</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Check live availability of charging slots and book your preferred time in advance to avoid waiting, ensuring a smooth charging experience.</p>
            </div>
            {/* Feature 3 */}
            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 border border-gray-100 dark:border-gray-600">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Secure & Transparent Payments</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Enjoy hassle-free and secure payments through multiple options, with transparent pricing, ensuring a smooth transaction every time.</p>
            </div>
            {/* Feature 4 */}
            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 border border-gray-100 dark:border-gray-600">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Intuitive User & Admin Panels</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Dedicated, user-friendly dashboards for EV owners to manage bookings and for station administrators to oversee the network efficiently.</p>
            </div>
            {/* Feature 5 */}
            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 border border-gray-100 dark:border-gray-600">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Smart Charge Management</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Optimize your charging sessions with smart features, monitor energy usage in real-time, and track your complete charging history for insights.</p>
            </div>
            {/* Feature 6 */}
            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 border border-gray-100 dark:border-gray-600">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l-2 5m2-5l-2-5m-2 5l4-9"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Eco-Friendly Initiative</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Join our community committed to sustainable transportation, reduce your carbon footprint, and contribute to a cleaner environment in Karnataka.</p>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 py-20 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-16 text-center text-blue-700 dark:text-blue-400">About EV Charge Hub</h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="p-8 bg-white dark:bg-gray-700 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-600">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  <strong>EV Charge Hub</strong> is an innovative platform designed to streamline the electric vehicle (EV) charging experience for users and administrators alike. Our mission is to empower the future of mobility by connecting EV drivers with accessible, reliable, and smart charging stations, fostering a greener transportation ecosystem in India.
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why EV Charge Hub?</h3>
                <ul className="list-disc list-inside ml-4 space-y-2 text-base text-gray-700 dark:text-gray-300">
                  <li>Locate nearby EV charging stations with ease and real-time data.</li>
                  <li>Book and manage charging slots seamlessly from anywhere.</li>
                  <li>Get detailed bunk info including address, map, available slots, and connector types.</li>
                  <li>Dedicated admin tools to add, manage, and monitor EV recharge bunks efficiently.</li>
                  <li>Modern, intuitive interface with full responsiveness and dark mode support for optimal user experience.</li>
                </ul>
              </div>
              <div className="flex justify-center items-center p-8 bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-xl">
                <img
                  src="https://placehold.co/600x400/D1FAE5/065F46?text=Our+Vision"
                  alt="Our Vision"
                  className="rounded-xl shadow-lg w-full max-w-md object-cover"
                />
              </div>
            </div>

            <div className="mt-16 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Our Vision</h2>
              <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
                At EV Charge Hub, we believe the future of transportation is electric and sustainable. We're committed to supporting India's transition to green energy by building a platform that is simple, efficient, and accessible for everyone—from enthusiastic EV owners to dedicated recharge station operators. We envision a future where range anxiety is a thing of the past, and charging an EV is as simple as fueling a traditional vehicle.
              </p>
            </div>

            <div className="mt-16 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Technologies We Use</h2>
              <div className="flex flex-wrap justify-center gap-4 text-md font-medium">
                <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-5 py-2 rounded-full shadow-md">React.js</span>
                <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-5 py-2 rounded-full shadow-md">Node.js</span>
                <span className="bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-5 py-2 rounded-full shadow-md">MongoDB</span>
                <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-5 py-2 rounded-full shadow-md">Tailwind CSS</span>
                <span className="bg-pink-100 dark:bg-pink-800 text-pink-800 dark:text-pink-200 px-5 py-2 rounded-full shadow-md">Firebase</span>
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-5 py-2 rounded-full shadow-md">JWT Auth</span>
                <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-5 py-2 rounded-full shadow-md">Google Maps API</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-16">
              How EV Charge Hub Works
            </h2>

            <div className="space-y-10">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-start md:items-center md:space-x-8 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all hover:shadow-xl transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-5xl md:text-6xl text-blue-500 dark:text-blue-300 flex-shrink-0 mb-4 md:mb-0">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 md:mt-0 mb-2">{`${index + 1}. ${step.title}`}</h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center">
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
                Ready to simplify your EV charging?{" "}
                <Link
                  to="/login/user"
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 font-semibold"
                >
                  Login now
                </Link>{" "}
                and book your slot!
              </p>
            </div>
          </div>
        </section>

        {/* Benefits of EVs in India/Karnataka */}
        <section id="benefits" className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-800 dark:to-emerald-900 text-gray-800 dark:text-white">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">Driving Towards a Greener & Smarter Karnataka</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">Embrace the numerous advantages of electric vehicles and smart charging solutions in our vibrant region:</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Benefit 1 */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-102 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-lime-500 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Reduced Emissions & Cleaner Air</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Contribute directly to cleaner air quality in Mudbidri and across Karnataka by choosing electric vehicles with zero tailpipe emissions.</p>
            </div>
            {/* Benefit 2 */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-102 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0v4m0 0h4m-4 0h-1m1 0v4m0 0h4m-4 0h-1m1 0v4m0 0h4m-4 0h-1m1 0v4m0 0h4m-4 0h-1"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Significant Cost Savings</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Benefit from lower running costs due to cheaper electricity compared to petrol/diesel, and reduced maintenance needs for EVs.</p>
            </div>
            {/* Benefit 3 */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-102 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-fuchsia-500 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9m-9 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m11.95 9.95l-1.414 1.414M10.05 10.05l-1.414-1.414M11.95 10.05l1.414 1.414M10.05 11.95l1.414 1.414"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Government Incentives & Support</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Take advantage of various state and central government incentives, subsidies, and tax benefits for EV adoption in India.</p>
            </div>
            {/* Benefit 4 */}
            <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-102 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-xl flex items-center justify-center mb-6 shadow-md">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 12c0 3.072 1.22 5.852 3.14 7.954L12 22.95l5.94-5.046A12.004 12.004 0 0021.08 12c0-3.072-1.22-5.852-3.14-7.954z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Quiet & Smooth Ride</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Enjoy a peaceful and comfortable driving experience with electric vehicles, known for their silent operation and smooth acceleration.</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Hear from satisfied EV owners who power their journeys with EV Charge Hub:</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
              <img className="w-20 h-20 rounded-full mb-6 border-4 border-blue-200 dark:border-blue-700" src="https://placehold.co/80x80/E0E7FF/3F51B5?text=JD" alt="John Doe" />
              <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">"EV Charge Hub has transformed my daily commute in Mudbidri. Finding a station and booking a slot is incredibly easy. Highly recommended!"</p>
              <p className="font-bold text-blue-600 dark:text-blue-400">- John D.</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Bengaluru, Karnataka</p>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
              <img className="w-20 h-20 rounded-full mb-6 border-4 border-green-200 dark:border-green-700" src="https://placehold.co/80x80/D1FAE5/065F46?text=AS" alt="Anjali Sharma" />
              <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">"The real-time availability feature is a game-changer. I never have to worry about long queues anymore. A must-have app for any EV owner in Karnataka!"</p>
              <p className="font-bold text-green-600 dark:text-green-400">- Anjali S.</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mysuru, Karnataka</p>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
              <img className="w-20 h-20 rounded-full mb-6 border-4 border-purple-200 dark:border-purple-700" src="https://placehold.co/80x80/EDE9FE/5B21B6?text=RK" alt="Rahul Kumar" />
              <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">"I appreciate the secure payment options and the detailed charging history. It helps me manage my EV expenses efficiently. Great service!"</p>
              <p className="font-bold text-purple-600 dark:text-purple-400">- Rahul K.</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mangaluru, Karnataka</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 px-6 md:px-12 lg:px-24 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Find quick answers to common questions about EV Charge Hub and EV charging.</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-200"
                >
                  <span className="text-xl font-semibold text-left text-gray-900 dark:text-white">{faq.question}</span>
                  <span className="text-2xl text-blue-600 dark:text-blue-400 font-bold transform transition-transform duration-300">
                    {activeIndex === index ? "−" : "+"}
                  </span>
                </button>
                {activeIndex === index && (
                  <div className="p-5 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 animate-fade-in-down">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section id="call-to-action" className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">Ready to Recharge Smarter?</h2>
            <p className="mb-10 text-lg md:text-xl max-w-2xl mx-auto">Join EV Charge Hub today and make your electric vehicle charging experience effortless, efficient, and enjoyable across Karnataka.</p>
            <Link to="/login/user" className="bg-white text-blue-700 px-10 py-4 rounded-full font-bold text-xl shadow-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1">
              Sign Up Now
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-20 px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-blue-700 dark:text-blue-400 mb-16 text-center">Get in Touch</h2>

            <p className="mb-10 text-lg text-gray-700 dark:text-gray-300 text-center">
              Have questions, suggestions, or need support? We'd love to hear from you. Fill out the form below and our team will get back to you soon.
            </p>

            <form onSubmit={handleContactSubmit} className="grid gap-8 bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
              {contactMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center text-md">
                  <span className="block sm:inline">{contactMessage}</span>
                </div>
              )}
              {contactError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center text-md">
                  <span className="block sm:inline">{contactError}</span>
                </div>
              )}

              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-200 mb-2" htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={contactFormData.name}
                  onChange={handleContactChange}
                  required
                  className="w-full px-5 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-lg"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-200 mb-2" htmlFor="email">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={contactFormData.email}
                  onChange={handleContactChange}
                  required
                  className="w-full px-5 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-lg"
                />
              </div>

              <div>
                <label className="block text-md font-medium text-gray-700 dark:text-gray-200 mb-2" htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={contactFormData.message}
                  onChange={handleContactChange}
                  rows="6"
                  required
                  className="w-full px-5 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-lg"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Send Message
              </button>
            </form>

            <div className="mt-16 text-center text-lg text-gray-700 dark:text-gray-300">
              <p className="mb-2">Email: <a href="mailto:support@evchargehub.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@evchargehub.com</a></p>
              <p className="mb-2">Phone: +91-98765 43210</p>
              <p>Location: Mudbidri, Karnataka, India</p>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-gray-800 dark:bg-gray-950 text-white py-12 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">EV Charge Hub</h3>
              <p className="text-gray-400 text-sm">Your trusted partner for EV charging solutions in Karnataka.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#hero" className="text-gray-300 hover:text-white transition-colors duration-200">Home</a></li>
                <li><a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors duration-200">How It Works</a></li>
                <li><a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#testimonials" className="text-gray-300 hover:text-white transition-colors duration-200">Testimonials</a></li>
                <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors duration-200">FAQ</a></li>
                <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">Contact Us</h3>
              <p className="text-gray-400 text-sm">Email: info@evchargehub.com</p>
              <p className="text-gray-400 text-sm">Phone: +91 98765 43210</p>
              <p className="text-gray-400 text-sm mt-2">Mudbidri, Karnataka, India</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-10 pt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} EV Charge Hub. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
