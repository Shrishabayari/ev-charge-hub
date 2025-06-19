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
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState(""); // State to manage submission status
    

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending"); // Set status to indicate submission is in progress
    
        // *** THIS IS THE ONLY LINE YOU NEED TO CHANGE ***
        // Use the Formspree URL you provided
        const formUrl = "https://formspree.io/f/xblgewvr"; 
    
        try {
          const response = await fetch(formUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify(formData),
          });
    
          if (response.ok) {
            setStatus("success");
            alert("Thank you for contacting us! We'll get back to you shortly.");
            setFormData({ name: "", email: "", message: "" }); // Clear form after success
          } else {
            const data = await response.json();
            console.error("Formspree error:", data);
            setStatus("error");
            alert("Oops! There was an issue sending your message. Please try again.");
          }
        } catch (error) {
          console.error("Network error:", error);
          setStatus("error");
          alert("Oops! A network error occurred. Please check your connection and try again.");
        }
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
                    <div className="max-w-7xl mx-auto flex -mt-16 flex-col md:flex-row items-center justify-between gap-12 relative z-10">
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

                <section id='about' className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-16 px-6 md:px-20">
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
                        <strong className="text-blue-600 dark:text-blue-300">EV Charge Hub</strong> is an innovative platform designed to streamline the electric vehicle (EV) charging experience for users and administrators alike in **Udupi, Karnataka**, and beyond. Our mission is to empower the future of mobility by connecting EV drivers with accessible, reliable, and smart charging stations, fostering a greener transportation ecosystem in India.
                    </p>

                    {/* Card-Based Sections */}
                    <div className="grid md:grid-cols-2 gap-10 mt-10">
                        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                        <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Why EV Charge Hub?</h2>
                        <ul className="list-disc ml-6 space-y-3 text-base text-gray-700 dark:text-gray-200">
                            <li>Locate nearby EV charging stations in **Udupi** and across **Karnataka** with ease.</li>
                            <li>Book and manage charging slots seamlessly in real-time within our network.</li>
                            <li>Get detailed bunk info including address, map specific to **Karnataka** locations, and available slots.</li>
                            <li>Dedicated admin tools to add, manage, and monitor EV recharge bunks efficiently, focusing on the **Karnataka** region.</li>
                            <li>Modern interface with responsive and dark mode support for optimal user experience.</li>
                        </ul>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                        <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Our Vision</h2>
                        <p className="text-base leading-relaxed text-gray-700 dark:text-gray-200">
                            At EV Charge Hub, we believe the future of transportation in **Karnataka** and across India is electric and sustainable. We're committed to supporting this transition by building a platform that is simple, efficient, and accessible for everyone—from enthusiastic EV owners in **Udupi** to dedicated recharge station operators throughout the state. We envision a future where range anxiety is a thing of the past, and charging an EV is as simple as fueling a traditional vehicle.
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
                                    to="/user/login"
                                    className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 font-semibold transition-colors duration-200"
                                >
                                    Login now
                                </Link>{" "}
                                and book your slot!
                            </p>
                        </div>
                    </div>
                </section>
                <section id="features" className="py-24 px-6 md:px-12 lg:px-24 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 animate-fade-in-down">Unlock the Power of Seamless EV Charging</h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto animate-fade-in-down delay-100">Effortless EV Charging: Experience Tomorrow's Convenience Today with Intelligent Slot Reservations and an Expansive Network.</p>
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
                        
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-lime-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Guaranteed Charging Slots</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Book your preferred charging slot in advance, eliminating waiting times and range anxiety across Karnataka, including **Mudbidri**.</p>
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
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Time Tracking</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Monitor your charging sessions and energy consumption directly through the app, helping you manage your EV expenses effectively.</p>
                        </div>
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-700">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9a2 2 0 00-2-2h-7a2 2 0 00-2 2v10a2 2 0 002 2zM9 19H7a2 2 0 01-2-2V7a2 2 0 012-2h2"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User-Friendly Mobile Apps</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Access intuitive and easy-to-use mobile applications for finding, booking, and managing your EV charging sessions.</p>
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

                <section id='contact' className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-16 px-6 md:px-20 flex items-center justify-center">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 bg-gray-50 dark:bg-gray-800 p-8 md:p-12 rounded-xl shadow-2xl">
                    {/* Left Column: Contact Information */}
                    <div className="flex flex-col justify-between">
                        <div>
                        <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 leading-tight">
                            Get in Touch
                        </h1>
                        <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
                            Have questions, suggestions, or need support? We're here to help you connect with the future of EV charging. Feel free to reach out to us!
                        </p>
                        </div>

                        <div className="space-y-6 mt-8">
                        {/* Contact Info Blocks (without icons) */}
                        <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Email Us</h3>
                            <a href="mailto:support@vrechargehub.com" className="text-blue-600 dark:text-blue-300 hover:underline text-lg">support@evrechargehub.com</a>
                        </div>

                        <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Call Us</h3>
                            <p className="text-lg text-gray-700 dark:text-gray-300">+91-9876543210</p>
                        </div>

                        <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Our Location</h3>
                            <p className="text-lg text-gray-700 dark:text-gray-300">Udupi, Karnataka, India</p>
                        </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <form onSubmit={handleSubmit} className="grid gap-6 p-6 md:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700">
                        <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition duration-200"
                            placeholder="Your Name"
                        />
                        </div>

                        <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="email">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-5 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition duration-200"
                            placeholder="youremail@gmail.com"
                        />
                        </div>

                        <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="message">Your Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="6"
                            required
                            className="w-full px-5 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-y transition duration-200"
                            placeholder="Tell us how we can help you..."
                        ></textarea>
                        </div>

                        <button
                        type="submit"
                        disabled={status === "sending"} // Disable button during submission
                        className={`w-full text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform ${
                            status === "sending"
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                        } focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
                        >
                        {status === "sending" ? "Sending..." : "Send Message"}
                        </button>
                        {status === "success" && (
                        <p className="text-green-600 dark:text-green-400 mt-2 text-center">Message sent successfully!</p>
                        )}
                        {status === "error" && (
                        <p className="text-red-600 dark:text-red-400 mt-2 text-center">Error sending message. Please try again.</p>
                        )}
                    </form>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 dark:bg-gray-950 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-4 text-blue-400">EV Charge Hub</h3>
                        <p className="text-gray-400">Your ultimate partner for seamless EV charging in India.</p>
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-1 text-blue-400">Quick Links</h3>
                        <ul className="space-y">
                            <li><a href="#hero" className="text-gray-300 hover:text-white transition-colors duration-200">Home</a></li>
                            <li><a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</a></li>
                            <li><a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors duration-200">How It Works</a></li>
                            <li><a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200">Features</a></li>
                            <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors duration-200">FAQ</a></li>
                            <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</a></li>
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

export default Homepage;