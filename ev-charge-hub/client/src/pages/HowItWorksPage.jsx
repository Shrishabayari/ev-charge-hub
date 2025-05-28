import React from "react";
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
  return (
    <div>
      <Navbar />
      <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-12 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-10 text-center">
            How It Works
          </h1>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start md:items-center md:space-x-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md transition-all hover:shadow-lg"
              >
                <div className="text-4xl md:text-5xl">{step.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold mt-2 md:mt-0">{`${index + 1}. ${step.title}`}</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <p className="text-lg font-medium">
              Ready to recharge?{" "}
              <a
                href="/user/login"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800"
              >
                Login now
              </a>{" "}
              and book your slot!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
