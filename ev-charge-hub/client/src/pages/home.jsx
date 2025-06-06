import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/navbars/Navbar';

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


const Homepage = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [contactFormData, setContactFormData] = useState({ name: '', email: '', message: '' });
    const [contactMessage, setContactMessage] = useState('');
    const [contactError, setContactError] = useState('');

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactFormData({ ...contactFormData, [name]: value });
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        setContactMessage('');
        setContactError('');

        if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
            setContactError('Please fill in all fields.');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            console.log('Contact Form Data:', contactFormData);
            setContactMessage('Your message has been sent successfully!');
            setContactFormData({ name: '', email: '', message: '' }); // Clear form
        }, 1000); // Simulate network delay
    };

    return (
        <div>
            <Navbar />
            <main className="dark:bg-gray-900 dark:text-white text-gray-800 font-inter overflow-hidden">
                <section id="hero" className="relative bg-gradient-to-br from-blue-200 to-indigo- dark:from-gray-800 dark:to-gray-900 py-24 md:py-32 px-6">
                    <div className="absolute inset-0 z-0 opacity-10">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <pattern id="pattern-circles" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                                <circle cx="5" cy="5" r="1" fill="rgba(255,255,255,0.2)"/>
                            </pattern>
                            <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"/>
                        </svg>
                    </div>
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 text-blue-450 dark:text-blue-600">
                                Power Your Journey with <span className="text-blue-600 dark:text-blue-800 drop-shadow-md">EV Charge Hub</span>
                            </h1>
                            <p className="text-xl lg:text-2xl mb-8 text-blue-600 dark:text-gray-300 animate-fade-in-up delay-200">
                                Locate, Book, and Recharge at your nearest EV Station. Easy. Fast. Smart.
                            </p>
                            <div className="flex justify-center md:justify-start gap-5 animate-fade-in-up delay-400">
                                <Link to="/user/login" className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                                    Get Started
                                </Link>
                                <Link to="/how-it-works" className="border-2 bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                                    How It Works
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center md:justify-end mt-12 md:mt-0 animate-fade-in-right">
                            <img
                                src="https://img.freepik.com/free-vector/electric-car-charging-station-concept-illustration_114360-8227.jpg?w=740&t=st=1701345600~exp=1701346200~hmac=2e5a6f2b4c1d0e8f0a0c9b0e2d1f0e8f0a0c9b0e2d1f0e8f"
                                alt="EV Charging Station"
                                className="rounded-3xl shadow-2xl w-full max-w-md border-4 border-blue-300 dark:border-gray-700 transform hover:scale-105 transition-transform duration-500"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/E0E7FF/3F51B5?text=EV+Charging" }}
                            />
                        </div>
                    </div>
                </section>

                <section id="features" className="py-24 px-6 md:px-12 lg:px-24 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 animate-fade-in-down">Unlock the Power of Seamless EV Charging</h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto animate-fade-in-down delay-100">Experience the future of EV charging with these key features, designed to make your journey effortless and efficient.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                        <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group animate-fade-in-up">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Extensive Network in Karnataka</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Discover a growing network of EV charging stations across Mudbidri and all major locations in Karnataka, ensuring you're always connected.</p>
                        </div>
                        <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Real-Time Availability & Booking</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Check live availability of charging slots and book your preferred time in advance to avoid waiting, ensuring a smooth charging experience.</p>
                        </div>
                        <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-200">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Secure & Transparent Payments</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Enjoy hassle-free and secure payments through multiple options, with transparent pricing, ensuring a smooth transaction every time.</p>
                        </div>
                        <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Intuitive User & Admin Panels</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Dedicated, user-friendly dashboards for EV owners to manage bookings and for station administrators to oversee the network efficiently.</p>
                        </div>
                        <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-400">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Smart Charge Management</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Optimize your charging sessions with smart features, monitor energy usage in real-time, and track your complete charging history for insights.</p>
                        </div>
                        <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-500">
                            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l-2 5m2-5l-2-5m-2 5l4-9"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Eco-Friendly Initiative</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Join our community committed to sustainable transportation, reduce your carbon footprint, and contribute to a cleaner environment in Karnataka.</p>
                        </div>
                    </div>
                </section>

                <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Introduction */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold mb-4 text-blue-700 dark:text-blue-400">
              About EV Charge Hub
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Connecting you to the future of sustainable electric vehicle charging in **Karnataka**.
            </p>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <p className="mb-12 text-lg md:text-xl leading-relaxed text-center max-w-4xl mx-auto">
            <strong className="text-blue-600 dark:text-blue-300">EV Charge Hub</strong> is an innovative platform designed to streamline the electric vehicle (EV) charging experience for users and administrators alike in **Mudbidri, Karnataka**, and beyond. Our mission is to empower the future of mobility by connecting EV drivers with accessible, reliable, and smart charging stations, fostering a greener transportation ecosystem in India.
          </p>

          {/* Card-Based Sections */}
          <div className="grid md:grid-cols-2 gap-10 mt-10">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Why EV Charge Hub?</h2>
              <ul className="list-disc ml-6 space-y-3 text-base text-gray-700 dark:text-gray-200">
                <li>Locate nearby EV charging stations in **Mudbidri** and across **Karnataka** with ease.</li>
                <li>Book and manage charging slots seamlessly in real-time within our network.</li>
                <li>Get detailed bunk info including address, map specific to **Karnataka** locations, and available slots.</li>
                <li>Dedicated admin tools to add, manage, and monitor EV recharge bunks efficiently, focusing on the **Karnataka** region.</li>
                <li>Modern interface with responsive and dark mode support for optimal user experience.</li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Our Vision</h2>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-200">
                At EV Charge Hub, we believe the future of transportation in **Karnataka** and across India is electric and sustainable. We're committed to supporting this transition by building a platform that is simple, efficient, and accessible for everyone—from enthusiastic EV owners in **Mudbidri** to dedicated recharge station operators throughout the state. We envision a future where range anxiety is a thing of the past, and charging an EV is as simple as fueling a traditional vehicle.
              </p>
            </div>
          </div>
        </div>
      </section>

                <section id="how-it-works" className="py-24 px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-16 animate-fade-in-down">
                            How EV Charge Hub Works
                        </h2>
                        <div className="space-y-12">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col md:flex-row items-center md:space-x-10 p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl transition-all hover:shadow-2xl transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} animate-fade-in-up delay-${index * 100}`}
                                >
                                    <div className={`text-6xl md:text-7xl flex-shrink-0 mb-6 md:mb-0 ${index % 2 === 0 ? 'text-blue-500' : 'text-emerald-500'} dark:text-blue-300`}>
                                        {step.icon}
                                    </div>
                                    <div className={index % 2 === 0 ? 'text-center md:text-left' : 'text-center md:text-right'}>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 md:mt-0 mb-3">{`${index + 1}. ${step.title}`}</h3>
                                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-20 text-center animate-fade-in-up delay-400">
                            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
                                Ready to simplify your EV charging?{" "}
                                <Link
                                    to="/login/user"
                                    className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 font-semibold transition-colors duration-200"
                                >
                                    Login now
                                </Link>{" "}
                                and book your slot!
                            </p>
                        </div>
                    </div>
                </section>
                
                <section id="benefits" className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-950 text-gray-800 dark:text-white">
                    <div className="max-w-7xl mx-auto text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-extrabold mb-8 text-gray-900 dark:text-white animate-fade-in-down">Seamless EV Recharging in Karnataka</h2>
                        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-down delay-100">Experience the future of EV charging with convenient slot bookings and a robust network:</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-lime-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Guaranteed Charging Slots</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Book your preferred charging slot in advance, eliminating waiting times and range anxiety across Karnataka, including **Mudbidri**.</p>
                        </div>
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0v4m0 0h4m-4 0h-1m1 0v4m0 0h4m-4 0h-1m1 0v4m0 0h4m-4 0h-1m1 0v4m0 0h4m-4 0h-1"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Real-time Station Availability</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Access live updates on charging station availability and status, allowing for efficient planning of your journeys throughout the state.</p>
                        </div>
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-200">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9m-9 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m11.95 9.95l-1.414 1.414M10.05 10.05l-1.414-1.414M11.95 10.05l1.414 1.414M10.05 11.95l1.414 1.414"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Optimized Charging Experience</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Intelligent booking systems help distribute demand, preventing congestion at popular charging points and ensuring a smooth experience.</p>
                        </div>
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 12c0 3.072 1.22 5.852 3.14 7.954L12 22.95l5.94-5.046A12.004 12.004 0 0021.08 12c0-3.072-1.22-5.852-3.14-7.954z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Efficient Route Planning</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Integrate charging stops seamlessly into your travel plans across Karnataka, ensuring smooth and uninterrupted long-distance journeys.</p>
                        </div>
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-400">
                            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Diverse Charger Types & Speeds</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Find a variety of charging options, from rapid DC chargers for quick top-ups to AC chargers for overnight power, catering to all EV models.</p>
                        </div>
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-500">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Enhanced Charging Network</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Benefit from Karnataka's continuously expanding EV charging infrastructure, with thousands of stations across the state, making charging accessible everywhere.</p>
                        </div>
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-600">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Time and Cost Tracking</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Monitor your charging sessions, energy consumption, and costs directly through the app, helping you manage your EV expenses effectively.</p>
                        </div>
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-700">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9a2 2 0 00-2-2h-7a2 2 0 00-2 2v10a2 2 0 002 2zM9 19H7a2 2 0 01-2-2V7a2 2 0 012-2h2"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User-Friendly Mobile Apps</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Access intuitive and easy-to-use mobile applications for finding, booking, and managing your EV charging sessions.</p>
                        </div>
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-800">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a2 2 0 002 2h10a2 2 0 002-2V7m-3 0V5a2 2 0 012-2h2.5a2 2 0 012 2v2m-6 0h-2m2 0h2m-2 0H8m-6 0l-3 9a2 2 0 002 2h10a2 2 0 002-2V7m-3 0v4m0 0h-4"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Support for Karnataka's Green Initiative</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Contribute to Karnataka's vision for clean mobility by utilizing smart charging solutions that align with the state's sustainable goals.</p>
                        </div>
                    </div>
                </section>

                <section id="faq" className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-800 text-gray-800 dark:text-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-16 animate-fade-in-down">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {faqData.map((faq, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in-up duration-700">
                                    <button
                                        className="flex justify-between items-center w-full text-left text-2xl font-semibold text-gray-900 dark:text-white focus:outline-none"
                                        onClick={() => toggleFAQ(index)}
                                    >
                                        {faq.question}
                                        <svg className={`w-6 h-6 transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    {activeIndex === index && (
                                        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed animate-fade-in">
                                            {faq.answer}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="contact" className="py-24 px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-16 animate-fade-in-down">Get in Touch</h2>
                        <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                            <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-8">Have questions, feedback, or partnership inquiries? We'd love to hear from you!</p>
                            {contactMessage && <p className="text-green-600 dark:text-green-400 text-center mb-4 text-lg font-semibold">{contactMessage}</p>}
                            {contactError && <p className="text-red-600 dark:text-red-400 text-center mb-4 text-lg font-semibold">{contactError}</p>}
                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={contactFormData.name}
                                        onChange={handleContactChange}
                                        className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={contactFormData.email}
                                        onChange={handleContactChange}
                                        className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="6"
                                        value={contactFormData.message}
                                        onChange={handleContactChange}
                                        className="shadow appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                        placeholder="Your message..."
                                    ></textarea>
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 dark:bg-gray-950 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-4 text-blue-400">EV Charge Hub</h3>
                        <p className="text-gray-400">Your ultimate partner for seamless EV charging in India.</p>
                        <div className="flex justify-center md:justify-start space-x-4 mt-6">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <svg fill="currentColor" viewBox="0 0 24 24" className="h-7 w-7"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.492v-9.294H9.692V11.69h3.156V9.673c0-3.109 1.894-4.801 4.659-4.801 1.325 0 2.474.099 2.801.144v3.069h-1.821c-1.42 0-1.696.677-1.696 1.663v2.187h3.428l-.558 3.422h-2.87V24h6.115c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"></path></svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <svg fill="currentColor" viewBox="0 0 24 24" className="h-7 w-7"><path d="M24 4.557a9.83 9.83 0 01-2.825.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.13 1.195 4.925 4.925 0 00-8.393 4.493 13.924 13.924 0 01-10.142-5.127 4.928 4.928 0 001.523 6.574A4.897 4.897 0 01.977 10.959v.062a4.928 4.928 0 003.951 4.821 4.945 4.945 0 01-2.221.084 4.935 4.935 0 004.61 3.42 9.886 9.886 0 01-6.102 2.105c-.397 0-.788-.023-1.171-.067A13.995 13.995 0 007.828 22c9.394 0 14.536-7.772 14.536-14.537 0-.222-.005-.443-.014-.664A10.43 10.43 0 0024 4.557z"></path></svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-200">
                                <svg fill="currentColor" viewBox="0 0 24 24" className="h-7 w-7"><path d="M12 2.163c3.204 0 3.584.012 4.85.07c3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 1.645.07 4.85s-.012 3.584-.07 4.85c-.148 3.252-1.691 4.771-4.919 4.919-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.584.07-4.85c.148-3.252 1.691-4.771 4.919-4.919 1.266-.058 1.646-.07 4.85-.07zm0-2.163C8.75 0 8.337.01 7.052.067 2.378.291.802 1.867.578 6.541.01 7.826 0 8.239 0 12s.01 4.174.067 5.459c.224 4.673 1.799 6.249 6.473 6.473 1.284.057 1.697.067 5.459.067s4.174-.01 5.459-.067c4.673-.224 6.249-1.799 6.473-6.473.057-1.284.067-1.697.067-5.459s-.01-4.174-.067-5.459c-.224-4.673-1.799-6.249-6.473-6.473-1.284-.057-1.697-.067-5.459-.067zM12 6.865c-2.833 0-5.135 2.302-5.135 5.135s2.302 5.135 5.135 5.135 5.135-2.302 5.135-5.135-2.302-5.135-5.135-5.135zm0 8.67C9.255 15.535 6.865 13.145 6.865 10.25S9.255 6.865 12 6.865s5.135 2.39 5.135 5.25S14.745 15.535 12 15.535zm6.865-8.67A1.56 1.56 0 1018.865 5.25a1.56 1.56 0 000 3.11z"></path></svg>
                            </a>
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-4 text-blue-400">Quick Links</h3>
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
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-4 text-blue-400">Contact Info</h3>
                        <p className="text-gray-400 mb-2">Email: <a href="mailto:support@evchargehub.com" className="hover:underline">support@evchargehub.com</a></p>
                        <p className="text-gray-400 mb-2">Phone: <a href="tel:+919876543210" className="hover:underline">+91-98765 43210</a></p>
                        <p className="text-gray-400">Location: Mudbidri, Karnataka, India</p>
                        <p className="text-gray-500 text-sm mt-6">&copy; {new Date().getFullYear()} EV Charge Hub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;