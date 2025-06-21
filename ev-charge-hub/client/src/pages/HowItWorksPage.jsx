import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/common/navbars/Navbar";

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

const HowItWorks = () => {
  // Use a Map to store intersection status for each step
  const [inViewSteps, setInViewSteps] = useState(new Map());

  // Array of refs to attach to each step element
  const stepRefs = useRef([]);
  stepRefs.current = []; // Clear refs on re-render to avoid stale references

  // Callback to add refs to the array
  const addStepRef = (el) => {
    if (el && !stepRefs.current.includes(el)) {
      stepRefs.current.push(el);
    }
  };

  useEffect(() => {
    const options = {
      root: null, // relative to the viewport
      rootMargin: "0px",
      threshold: 0.3, // Trigger when 30% of the item is visible
    };

    const observer = new IntersectionObserver((entries) => {
      setInViewSteps((prev) => {
        const newMap = new Map(prev);
        entries.forEach((entry) => {
          const index = stepRefs.current.indexOf(entry.target);
          if (index !== -1) {
            newMap.set(index, entry.isIntersecting); // Store true/false for each step
          }
        });
        return newMap;
      });
    }, options);

    // Observe each step element
    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Clean up observer on component unmount
    return () => {
      stepRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <div>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-950 dark:to-gray-800 text-gray-800 dark:text-gray-100 py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 dark:text-blue-300 mb-4 tracking-tight">
              Our Simple Process
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Discover how easy it is to find, book, and manage your EV charging.
            </p>
            <div className="w-32 h-1.5 bg-blue-600 dark:bg-blue-400 mx-auto mt-8 rounded-full shadow-md"></div>
          </div>

          <div className="relative">
            {/* Vertical Line for Timeline Effect (Desktop Only) */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1.5 bg-blue-300 dark:bg-blue-700 rounded-full h-full"></div>

            {steps.map((step, index) => {
              const isInView = inViewSteps.get(index) || false; // Check if this step is currently in view
              return (
                <div
                  key={index}
                  ref={addStepRef} // Attach ref to this step's container
                  className="relative mb-12 md:mb-16 flex items-center justify-center"
                >
                  {/* Step Card - Dynamic styling based on isInView */}
                  <div
                    className={`w-full md:w-5/12 p-8 rounded-xl shadow-lg dark:shadow-2xl transition-all duration-1000 ease-out border 
                      ${index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}
                      ${isInView // Dynamic styling based on isInView
                        ? "opacity-100 transform translate-y-0 bg-white dark:bg-gray-850 shadow-xl dark:shadow-2xl border-blue-200 dark:border-blue-600"
                        : "opacity-0 transform translate-y-10 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700" // Hidden/off-screen state
                      }`}
                  >
                    <div className="flex items-center mb-4">
                      {/* Emoji Icon */}
                      <div className={`text-4xl mr-4 p-3 rounded-full shadow-inner transition-colors duration-1000 
                        ${isInView ? "bg-blue-200 dark:bg-blue-900" : "bg-blue-100 dark:bg-blue-800"}`}>
                        {step.icon}
                      </div>
                      <h3 className={`text-2xl font-bold transition-colors duration-1000 
                        ${isInView ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-200"}`}>
                        {step.title}
                      </h3>
                    </div>
                    <p className={`mt-4 text-base md:text-lg leading-relaxed transition-colors duration-1000 
                      ${isInView ? "text-gray-700 dark:text-gray-300" : "text-gray-600 dark:text-gray-400"}`}>
                      {step.description}
                    </p>
                  </div>

                  {/* Connector Dot (Desktop Only) - Dynamic styling based on isInView */}
                  <div className={`hidden md:block absolute left-1/2 transform -translate-x-1/2 z-10 w-8 h-8 rounded-full border-4 shadow-md transition-colors duration-1000 
                    ${isInView
                      ? "bg-blue-600 dark:bg-blue-400 border-white dark:border-gray-950"
                      : "bg-blue-300 dark:bg-blue-700 border-white dark:border-gray-950" // Inactive dot color
                    }`}>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center bg-blue-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-300 mb-6">
              Ready to Recharge Your EV?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto">
              Join thousands of satisfied EV drivers and experience seamless charging.
            </p>
            <a
              href="/user/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full transition duration-300 transform hover:scale-105 shadow-lg text-lg tracking-wide focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Get Started Now
            </a>
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

export default HowItWorks;