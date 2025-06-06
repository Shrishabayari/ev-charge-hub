import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from './AnimatedSection'; // Import AnimatedSection
import AboutUs from './AboutPage';
import HowItWorks from './HowItWorksPage';
import FAQ from './FAQPage';
import ContactUs from './ContactPage'; // Assuming you also want to move contact to a separate file

const Homepage = () => {
    // Add custom CSS for animations (keep this in a central place if used across multiple animated sections)
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeInDown {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeInRight {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .animate-fade-in-up {
                animation: fadeInUp 0.7s ease-out forwards;
            }
            
            .animate-fade-in-down {
                animation: fadeInDown 0.7s ease-out forwards;
            }
            
            .animate-fade-in-left {
                animation: fadeInLeft 0.7s ease-out forwards;
            }
            
            .animate-fade-in-right {
                animation: fadeInRight 0.7s ease-out forwards;
            }
            
            .animate-fade-in {
                animation: fadeIn 0.7s ease-out forwards;
            }
            
            .animate-scale-in {
                animation: scaleIn 0.7s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div>
            <main className="dark:bg-gray-900 dark:text-white text-gray-800 font-inter overflow-hidden">

                {/* Hero Section */}
                <section id="hero" className="relative bg-gradient-to-br from-blue-200 to-indigo-400 dark:from-gray-800 dark:to-gray-900 py-24 md:py-32 px-6">
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
                            <AnimatedSection animation="fadeInUp">
                                <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 text-blue-450 dark:text-blue-600">
                                    Power Your Journey with <span className="text-blue-600 dark:text-blue-800 drop-shadow-md">EV Charge Hub</span>
                                </h1>
                            </AnimatedSection>
                            <AnimatedSection animation="fadeInUp" delay={200}>
                                <p className="text-xl lg:text-2xl mb-8 text-blue-600 dark:text-gray-300">
                                    Locate, Book, and Recharge at your nearest EV Station. Easy. Fast. Smart.
                                </p>
                            </AnimatedSection>
                            <AnimatedSection animation="fadeInUp" delay={400}>
                                <div className="flex justify-center md:justify-start gap-5">
                                    <Link to="/get-started" className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                                        Get Started
                                    </Link>
                                    <Link to="/how-it-works" className="border-2 bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                                        How It Works
                                    </Link>
                                </div>
                            </AnimatedSection>
                        </div>
                        <div className="flex-1 flex justify-center md:justify-end mt-12 md:mt-0">
                            <AnimatedSection animation="fadeInRight" delay={600}>
                                <img
                                    src="https://img.freepik.com/free-vector/electric-car-charging-station-concept-illustration_114360-8227.jpg"
                                    alt="EV Charging Station"
                                    className="rounded-3xl shadow-2xl w-full max-w-md border-4 border-blue-300 dark:border-gray-700 transform hover:scale-105 transition-transform duration-500"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/E0E7FF/3F51B5?text=EV+Charging" }}
                                />
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Key Features Section (can also be a separate component) */}
                <section id="features" className="py-24 px-6 md:px-12 lg:px-24 bg-white dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto text-center mb-16">
                        <AnimatedSection animation="fadeInDown">
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-8">Unlock the Power of Seamless EV Charging</h2>
                        </AnimatedSection>
                        <AnimatedSection animation="fadeInDown" delay={100}>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Experience the future of EV charging with these key features, designed to make your journey effortless and efficient.</p>
                        </AnimatedSection>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
                        {/* Feature 1 */}
                        <AnimatedSection animation="fadeInUp" delay={0}>
                            <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Extensive Network in Karnataka</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Discover a growing network of EV charging stations across Mudbidri and all major locations in Karnataka, ensuring you're always connected.</p>
                            </div>
                        </AnimatedSection>
                        
                        {/* Feature 2 */}
                        <AnimatedSection animation="fadeInUp" delay={100}>
                            <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Real-Time Availability & Booking</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Check live availability of charging slots and book your preferred time in advance to avoid waiting, ensuring a smooth charging experience.</p>
                            </div>
                        </AnimatedSection>
                        
                        {/* Continue with other features */}
                        <AnimatedSection animation="fadeInUp" delay={200}>
                            <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Secure & Transparent Payments</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Enjoy hassle-free and secure payments through multiple options, with transparent pricing, ensuring a smooth transaction every time.</p>
                            </div>
                        </AnimatedSection>
                        
                        <AnimatedSection animation="fadeInUp" delay={300}>
                            <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Intuitive User & Admin Panels</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Dedicated, user-friendly dashboards for EV owners to manage bookings and for station administrators to oversee the network efficiently.</p>
                            </div>
                        </AnimatedSection>
                        
                        <AnimatedSection animation="fadeInUp" delay={400}>
                            <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Smart Charge Management</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Optimize your charging sessions with smart features, monitor energy usage in real-time, and track your complete charging history for insights.</p>
                            </div>
                        </AnimatedSection>
                        
                        <AnimatedSection animation="fadeInUp" delay={500}>
                            <div className="p-10 bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 group">
                                <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-700 text-white rounded-2xl flex items-center justify-center mb-7 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l-2 5m2-5l-2-5m-2 5l4-9"></path></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Eco-Friendly Initiative</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">Join our community committed to sustainable transportation, reduce your carbon footprint, and contribute to a cleaner environment in Karnataka.</p>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>

                <AboutUs />
                <HowItWorks />
                <FAQ />
                <ContactUs /> {/* Render the ContactUs component */}

            </main>
        </div>
    );
};

export default Homepage;