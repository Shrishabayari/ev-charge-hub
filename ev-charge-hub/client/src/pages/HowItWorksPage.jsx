import React from "react";
import Navbar from "../components/common/navbars/Navbar";

const HowItWorks = () => {
  const steps = [
    {
      title: "1. Sign Up or Login",
      description: "Create an account or log in as a user or admin to access recharge features and manage EV bunks.",
    },
    {
      title: "2. Locate Nearby Recharge Bunks",
      description: "Use the search feature to find EV recharge stations near your location with real-time data.",
    },
    {
      title: "3. Check Availability",
      description: "View available slots and bunk details including timing, capacity, and location map.",
    },
    {
      title: "4. Book a Slot",
      description: "Reserve a slot for your EV recharge in advance to avoid waiting in queues.",
    },
    {
      title: "5. Recharge & Go",
      description: "Visit the recharge bunk at your scheduled time, recharge your EV, and you're good to go!",
    },
  ];

  return (
    <div>
        <Navbar/>
        <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-12 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-10 text-center">
            How It Works
            </h1>

            <div className="space-y-10">
            {steps.map((step, index) => (
                <div
                key={index}
                className="flex flex-col md:flex-row items-start md:items-center md:space-x-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow"
                >
                <div className="flex-shrink-0 text-4xl font-extrabold text-blue-500 dark:text-blue-400">
                    {step.title.split(".")[0]}.
                </div>
                <div>
                    <h3 className="text-xl font-semibold">{step.title.split(". ")[1]}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
                </div>
            ))}
            </div>

            <div className="mt-12 text-center">
            <p className="text-lg font-medium">
                Ready to recharge?{" "}
                <a href="/login/user" className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800">
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
