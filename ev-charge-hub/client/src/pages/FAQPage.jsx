import React, { useState } from "react";
import Navbar from "../components/common/navbars/Navbar";

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


const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-gray-950 dark:to-gray-800 text-gray-800 dark:text-gray-100 py-20 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-extrabold text-blue-800 dark:text-blue-300 mb-5 tracking-tight">
              Questions & Answers
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Find quick answers to the most common questions about EV Recharge Hub.
            </p>
            <div className="w-28 h-1.5 bg-blue-600 dark:bg-blue-400 mx-auto mt-8 rounded-full shadow-md"></div>
          </div>

          <div className="space-y-6">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-850 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
              >
                <button
                  onClick={() => toggle(index)}
                  aria-expanded={activeIndex === index ? "true" : "false"}
                  className={`w-full flex justify-between items-center p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-850 transition-all duration-300 ease-in-out
                    ${activeIndex === index
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-100 font-semibold'
                      : 'bg-white dark:bg-gray-850 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  <span className="text-lg md:text-xl font-medium flex-1 pr-4">{faq.question}</span>
                  <span className={`text-2xl font-bold transition-transform duration-300 ease-in-out ${activeIndex === index ? "rotate-45 text-blue-600 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`}>
                    +
                  </span>
                </button>
                {/* Answer Content */}
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                    activeIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden"> {/* This div ensures content inside grid-rows is hidden */}
                    <div className="p-6 pt-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default FAQ;