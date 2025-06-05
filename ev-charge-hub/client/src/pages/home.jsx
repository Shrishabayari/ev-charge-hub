import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/navbars/Navbar'; // Assuming you have a Navbar component

const steps = [
    {
        title: "Locate Stations",
        description: "Effortlessly find the nearest EV charging stations on an interactive map, complete with real-time availability and directions.",
        icon: "📍" // Unicode characters for icons
    },
    {
        title: "Book Your Slot",
        description: "Secure your charging slot in advance with our easy-to-use booking system, ensuring a hassle-free experience upon arrival.",
        icon: "🗓️"
    },
    {
        title: "Recharge & Go",
        description: "Connect your EV, initiate charging, and monitor your session directly from the app. Pay securely and get back on the road.",
        icon: "⚡"
    },
    {
        title: "Manage & Monitor",
        description: "Keep track of your charging history, manage payments, and receive smart notifications for an optimized EV ownership experience.",
        icon: "📊"
    }
];

const faqData = [
    {
        question: "How do I find an EV charging station?",
        answer: "You can find charging stations using the interactive map on our platform. It shows real-time availability, connector types, and navigation details."
    },
    {
        question: "Can I book a charging slot in advance?",
        answer: "Yes, our platform allows you to check real-time slot availability and book your preferred charging time at any station."
    },
    {
        question: "What payment methods are accepted?",
        answer: "We support various secure payment options, including credit/debit cards, UPI, and popular digital wallets, ensuring convenient transactions."
    },
    {
        question: "How accurate is the real-time availability?",
        answer: "Our system updates station availability in real-time based on live data from the charging stations, providing you with the most accurate information."
    },
    {
        question: "Is EV Charge Hub available outside Karnataka?",
        answer: "Currently, our primary focus is on expanding our network across Karnataka. We aim to expand to other regions in India soon."
    }
];

const Homepage = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [contactFormData, setContactFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
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

        // Basic validation
        if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
            setContactError('Please fill in all fields.');
            return;
        }

        // Simulate API call for contact form
        setTimeout(() => {
            console.log('Contact Form Data:', contactFormData);
            setContactMessage('Your message has been sent successfully!');
            setContactFormData({ name: '', email: '', message: '' }); // Clear form
        }, 1000);
    };

    return (
        <div>
            <Navbar />
            <main className="dark:bg-gray-900 dark:text-white text-gray-800 font-inter overflow-hidden">

                {/* Hero Section */}
                <section id="hero" className="relative bg-gradient-to-br from-blue-200 to-indigo- dark:from-gray-800 dark:to-gray-900 py-24 md:py-32 px-6">
                    <div className="absolute inset-0 z-0 opacity-10">
                        {/* Subtle background pattern or texture */}
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
                                src="https://img.freepik.com/free-vector/electric-car-charging-station-concept-illustration_114360-8227.jpg?w=740&t=st=1701345600~exp=1701346200~hmac=2e5a6f2b4c1d0e8f0a0c9b0e2d1f0e8f0a0c9b0e2d1f0e8f0a0c9b0e2d1f0e8f" // Example of a better image
                                alt="EV Charging Station"
                                className="rounded-3xl shadow-2xl w-full max-w-md border-4 border-blue-300 dark:border-gray-700 transform hover:scale-105 transition-transform duration-500"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/E0E7FF/3F51B5?text=EV+Charging" }}
                            />
                        </div>
                    </div>
                </section>

                {/* Key Features Section */}
                <section id="features" className="py-24 px-6 md:px-12 lg:px-24 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 animate-fade-in-down">Unlock the Power of Seamless EV Charging</h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto animate-fade-in-down delay-100">Experience the future of EV charging with these key features, designed to make your journey effortless and efficient.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                        {/* Feature 1 */}
                        <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group animate-fade-in-up">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Extensive Network in Karnataka</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Discover a growing network of EV charging stations across Mudbidri and all major locations in Karnataka, ensuring you're always connected.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Real-Time Availability & Booking</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Check live availability of charging slots and book your preferred time in advance to avoid waiting, ensuring a smooth charging experience.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-200">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Secure & Transparent Payments</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Enjoy hassle-free and secure payments through multiple options, with transparent pricing, ensuring a smooth transaction every time.</p>
                        </div>
                        {/* Feature 4 */}
                        <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Intuitive User & Admin Panels</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Dedicated, user-friendly dashboards for EV owners to manage bookings and for station administrators to oversee the network efficiently.</p>
                        </div>
                        {/* Feature 5 */}
                        <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-400">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Smart Charge Management</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Optimize your charging sessions with smart features, monitor energy usage in real-time, and track your complete charging history for insights.</p>
                        </div>
                        {/* Feature 6 */}
                        <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-500">
                            <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l-2 5m2-5l-2-5m-2 5l4-9"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Eco-Friendly Initiative</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Join our community committed to sustainable transportation, reduce your carbon footprint, and contribute to a cleaner environment in Karnataka.</p>
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section id="about" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-800 text-gray-800 dark:text-gray-100 py-24 px-6 md:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-extrabold mb-16 text-center text-blue-700 dark:text-blue-400 animate-fade-in-down">About EV Charge Hub</h2>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 animate-fade-in-left">
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-5 border-b-2 border-blue-500 pb-2">Our Mission</h3>
                                <p className="mb-7 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                                    <strong>EV Charge Hub</strong> is an innovative platform designed to streamline the electric vehicle (EV) charging experience for users and administrators alike. Our mission is to empower the future of mobility by connecting EV drivers with accessible, reliable, and smart charging stations, fostering a greener transportation ecosystem in India.
                                </p>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-5 border-b-2 border-blue-500 pb-2">Why EV Charge Hub?</h3>
                                <ul className="list-disc list-inside ml-4 space-y-3 text-base text-gray-700 dark:text-gray-300">
                                    <li><span className="font-semibold text-blue-600 dark:text-blue-300">Locate with Ease:</span> Find nearby EV charging stations with ease and real-time data.</li>
                                    <li><span className="font-semibold text-blue-600 dark:text-blue-300">Seamless Booking:</span> Book and manage charging slots seamlessly from anywhere.</li>
                                    <li><span className="font-semibold text-blue-600 dark:text-blue-300">Detailed Bunk Info:</span> Get detailed bunk info including address, map, available slots, and connector types.</li>
                                    <li><span className="font-semibold text-blue-600 dark:text-blue-300">Dedicated Admin Tools:</span> Dedicated admin tools to add, manage, and monitor EV recharge bunks efficiently.</li>
                                    <li><span className="font-semibold text-blue-600 dark:text-blue-300">Modern Interface:</span> Modern, intuitive interface with full responsiveness and dark mode support for optimal user experience.</li>
                                </ul>
                            </div>
                            <div className="flex justify-center items-center p-8 bg-gray-100 dark:bg-gray-900 rounded-3xl shadow-2xl animate-fade-in-right">
                                <img
                                    src="https://img.freepik.com/free-vector/gradient-ev-charging-station-illustration_23-2149372950.jpg?w=740&t=st=1701345800~exp=1701346400~hmac=2e5a6f2b4c1d0e8f0a0c9b0e2d1f0e8f0a0c9b0e2d1f0e8f0a0c9b0e2d1f0e8f" // More illustrative image
                                    alt="Our Vision for EV Charging"
                                    className="rounded-2xl shadow-xl w-full max-w-md object-cover border-4 border-emerald-300 dark:border-emerald-700"
                                />
                            </div>
                        </div>

                        <div className="mt-20 text-center animate-fade-in-up">
                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">Our Vision</h2>
                            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
                                At EV Charge Hub, we believe the future of transportation is electric and sustainable. We're committed to supporting India's transition to green energy by building a platform that is simple, efficient, and accessible for everyone—from enthusiastic EV owners to dedicated recharge station operators. We envision a future where range anxiety is a thing of the past, and charging an EV is as simple as fueling a traditional vehicle.
                            </p>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
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

                {/* Benefits of EVs in India/Karnataka */}
                <section id="benefits" className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-950 text-gray-800 dark:text-white">
                    <div className="max-w-7xl mx-auto text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-extrabold mb-8 text-gray-900 dark:text-white animate-fade-in-down">Driving Towards a Greener & Smarter Karnataka</h2>
                        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-down delay-100">Embrace the numerous advantages of electric vehicles and smart charging solutions in our vibrant region:</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                        {/* Benefit 1 */}
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-lime-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Reduced Emissions & Cleaner Air</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Contribute directly to cleaner air quality in Mudbidri and across Karnataka by choosing electric vehicles with zero tailpipe emissions.</p>
                        </div>
                        {/* Benefit 2 */}
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-100">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0v4m0 0h4m-4 0h-1m1 0v4m0 0h4m-4 0h-1m1 0v4m0 0h4m-4 0h-1m1 0v4m0 0h4m-4 0h-1"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Significant Cost Savings</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Benefit from lower running costs due to cheaper electricity compared to petrol/diesel, and reduced maintenance needs for EVs.</p>
                        </div>
                        {/* Benefit 3 */}
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-200">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9m-9 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m11.95 9.95l-1.414 1.414M10.05 10.05l-1.414-1.414M11.95 10.05l1.414 1.414M10.05 11.95l1.414 1.414"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Government Incentives & Support</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Take advantage of various state and central government incentives, subsidies, and tax benefits for EV adoption in India.</p>
                        </div>
                        {/* Benefit 4 */}
                        <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-102 border border-gray-100 dark:border-gray-700 group animate-fade-in-up delay-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 12c0 3.072 1.22 5.852 3.14 7.954L12 22.95l5.94-5.046A12.004 12.004 0 0021.08 12c0-3.072-1.22-5.852-3.14-7.954z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiet & Smooth Ride</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Enjoy a peaceful and comfortable driving experience with electric vehicles, known for their silent operation and smooth acceleration.</p>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-24 px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 animate-fade-in-down">What Our Users Say</h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto animate-fade-in-down delay-100">Hear from satisfied EV owners who power their journeys with EV Charge Hub:</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                        {/* Testimonial 1 */}
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center animate-fade-in-up">
                            <img className="w-24 h-24 rounded-full mb-7 border-4 border-blue-400 dark:border-blue-700 object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cfd46dbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTIyMDF8MHwxfHNlYXJjaHw1fHxtYWxlJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzA1MjA1ODQ4fDA&ixlib=rb-4.0.3&q=80&w=400" alt="John Doe" />
                            <p className="text-xl italic text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">"EV Charge Hub has transformed my daily commute in Mudbidri. Finding a station and booking a slot is incredibly easy. Highly recommended!"</p>
                            <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">- John D.</p>
                            <p className="text-base text-gray-500 dark:text-gray-400 mt-1">Bengaluru, Karnataka</p>
                        </div>
                        {/* Testimonial 2 */}
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center animate-fade-in-up delay-100">
                            <img className="w-24 h-24 rounded-full mb-7 border-4 border-green-400 dark:border-green-700 object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTIyMDF8MHwxfHNlYXJjaHw0fHxmZW1hbGUlMjBwb3J0cmFpdHxlbnwwfHx8fDE3MDUyMDU4NDh8MA&ixlib=rb-4.0.3&q=80&w=400" alt="Anjali Sharma" />
                            <p className="text-xl italic text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">"The real-time availability feature is a game-changer. I never have to worry about long queues anymore. A must-have app for any EV owner in Karnataka!"</p>
                            <p className="font-bold text-green-600 dark:text-green-400 text-lg">- Anjali S.</p>
                            <p className="text-base text-gray-500 dark:text-gray-400 mt-1">Mysuru, Karnataka</p>
                        </div>
                        {/* Testimonial 3 */}
                        <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center animate-fade-in-up delay-200">
                            <img className="w-24 h-24 rounded-full mb-7 border-4 border-purple-400 dark:border-purple-700 object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTIyMDF8MHwxfHNlYXJjaHwxNXx8bWFsZSUyMHBvcnRyYWl0fGVufDB8fHx8MTcwNTIwNTg0OHww&ixlib=rb-4.0.3&q=80&w=400" alt="Rahul Kumar" />
                            <p className="text-xl italic text-gray-700 dark:text-gray-300 mb-5 leading-relaxed">"I appreciate the secure payment options and the detailed charging history. It helps me manage my EV expenses efficiently. Great service!"</p>
                            <p className="font-bold text-purple-600 dark:text-purple-400 text-lg">- Rahul K.</p>
                            <p className="text-base text-gray-500 dark:text-gray-400 mt-1">Mangaluru, Karnataka</p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="py-24 px-6 md:px-12 lg:px-24 bg-white dark:bg-gray-800">
                    <div className="max-w-7xl mx-auto text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-8 animate-fade-in-down">Frequently Asked Questions</h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto animate-fade-in-down delay-100">Find quick answers to common questions about EV Charge Hub and EV charging.</p>
                    </div>
                    <div className="max-w-4xl mx-auto space-y-7">
                        {faqData.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in-up"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex justify-between items-center p-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-200"
                                >
                                    <span className="text-xl md:text-2xl font-semibold text-left text-gray-900 dark:text-white">{faq.question}</span>
                                    <span className="text-3xl text-blue-600 dark:text-blue-400 font-bold transform transition-transform duration-300">
                                        {activeIndex === index ? "−" : "+"}
                                    </span>
                                </button>
                                {activeIndex === index && (
                                    <div className="p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 animate-fade-in-down">
                                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section id="call-to-action" className="py-24 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-blue-900 dark:to-indigo-950 text-white text-center">
                    <div className="max-w-4xl mx-auto animate-fade-in-up">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight drop-shadow-lg">Ready to Recharge Smarter?</h2>
                        <p className="mb-12 text-lg md:text-xl max-w-2xl mx-auto text-blue-100 dark:text-gray-300">Join EV Charge Hub today and make your electric vehicle charging experience effortless, efficient, and enjoyable across Karnataka.</p>
                        <Link to="/login/user" className="bg-white text-blue-800 px-12 py-5 rounded-full font-bold text-xl shadow-xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
                            Sign Up Now
                        </Link>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-24 px-6 md:px-12 lg:px-24">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-16 text-center animate-fade-in-down">Get in Touch</h2>

                        <p className="mb-12 text-lg md:text-xl text-gray-700 dark:text-gray-300 text-center animate-fade-in-down delay-100">
                            Have questions, suggestions, or need support? We'd love to hear from you. Fill out the form below and our team will get back to you soon.
                        </p>

                        <form onSubmit={handleContactSubmit} className="grid gap-8 bg-gray-50 dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                            {contactMessage && (
                                <div className="bg-green-100 border border-green-400 text-green-700 px-5 py-4 rounded-lg relative text-center text-md font-semibold animate-fade-in">
                                    <span className="block sm:inline">{contactMessage}</span>
                                </div>
                            )}
                            {contactError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-4 rounded-lg relative text-center text-md font-semibold animate-fade-in">
                                    <span className="block sm:inline">{contactError}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-3" htmlFor="name">Your Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={contactFormData.name}
                                    onChange={handleContactChange}
                                    required
                                    className="w-full px-6 py-4 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-lg shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-3" htmlFor="email">Your Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={contactFormData.email}
                                    onChange={handleContactChange}
                                    required
                                    className="w-full px-6 py-4 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-lg shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-3" htmlFor="message">Your Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={contactFormData.message}
                                    onChange={handleContactChange}
                                    rows="7"
                                    required
                                    className="w-full px-6 py-4 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-lg shadow-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Send Message
                            </button>
                        </form>
                        <div className="mt-16 text-center text-lg md:text-xl text-gray-700 dark:text-gray-300 animate-fade-in-up delay-200">
                            <p className="mb-3">Email: <a href="mailto:support@evchargehub.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">support@evchargehub.com</a></p>
                            <p className="mb-3">Phone: <a href="tel:+919876543210" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">+91-98765 43210</a></p>
                            <p>Location: Mudbidri, Karnataka, India</p>
                        </div>
                    </div>
                </section>

                {/* Footer Section */}
                <footer className="bg-gray-900 dark:bg-gray-950 text-white py-14 px-6 md:px-12 lg:px-24">
                    <div className="max-w-7xl mx-auto text-center md:text-left grid grid-cols-1 md:grid-cols-4 gap-10">
                        <div>
                            <h3 className="text-2xl font-bold mb-5 text-blue-400">EV Charge Hub</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">Your trusted partner for EV charging solutions in Karnataka, simplifying your electric journey with innovation and reliability.</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-5 text-blue-400">Quick Links</h3>
                            <ul className="space-y-3">
                                <li><a href="#hero" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg">Home</a></li>
                                <li><a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg">About Us</a></li>
                                <li><a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg">How It Works</a></li>
                                <li><a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg">Features</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-5 text-blue-400">More Info</h3>
                            <ul className="space-y-3">
                                <li><a href="#testimonials" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg">Testimonials</a></li>
                                <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg">FAQ</a></li>
                                <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg">Contact</a></li>
                                <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors duration-200 text-lg">Privacy Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-5 text-blue-400">Connect With Us</h3>
                            <div className="flex justify-center md:justify-start space-x-4 mb-6">
                                {/* Social Media Icons (replace with actual links) */}
                                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                                    <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-8 h-8" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                                    <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-8 h-8" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-8 h-8" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>
                                </a>
                            </div>
                            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} EV Charge Hub. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Homepage;