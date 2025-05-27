import React, { useState } from "react";
import Navbar from "../components/common/navbars/Navbar";

const faqData = [
  {
    question: "What is V Recharge Hub?",
    answer:
      "V Recharge Hub is an electric vehicle recharge management platform that allows users to locate, book, and recharge at EV stations easily and efficiently.",
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
      "Yes, booking a slot on V Recharge Hub is free. However, actual recharge cost may vary based on the station and slot duration.",
  },
  {
    question: "How can I become an admin or register my recharge station?",
    answer:
      "If you own an EV recharge station, you can register as an admin through the 'Admin Login' section and manage your bunk and available slots.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
        <Navbar/>
        <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-12 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-blue-400 mb-10">
            Frequently Asked Questions
            </h1>

            <div className="space-y-6">
            {faqData.map((faq, index) => (
                <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden"
                >
                <button
                    onClick={() => toggle(index)}
                    className="w-full flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
                >
                    <span className="text-lg font-medium text-left">{faq.question}</span>
                    <span className="text-xl">{activeIndex === index ? "−" : "+"}</span>
                </button>
                {activeIndex === index && (
                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                    </div>
                )}
                </div>
            ))}
            </div>
        </div>
        </section>
    </div>
  );
};

export default FAQ;
