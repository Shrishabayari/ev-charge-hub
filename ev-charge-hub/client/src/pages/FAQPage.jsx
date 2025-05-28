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
