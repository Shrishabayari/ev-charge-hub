import React from "react";
import Navbar from "../components/common/navbars/Navbar";

const About = () => {
  return (
    <div>
      <Navbar />
      <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Introduction */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold mb-4 text-blue-700 dark:text-blue-400">
              About EV Recharge Hub
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Connecting you to the future of sustainable electric vehicle charging.
            </p>
            <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <p className="mb-12 text-lg md:text-xl leading-relaxed text-center max-w-4xl mx-auto">
            <strong className="text-blue-600 dark:text-blue-300">EV Recharge Hub</strong> is an innovative platform designed to streamline the electric vehicle (EV) charging experience for users and administrators alike. Our mission is to empower the future of mobility by connecting EV drivers with accessible, reliable, and smart charging stations.
          </p>

          {/* Card-Based Sections */}
          <div className="grid md:grid-cols-2 gap-10 mt-10">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Why EV Recharge Hub?</h2>
              <ul className="list-disc ml-6 space-y-3 text-base text-gray-700 dark:text-gray-200">
                <li>Locate nearby EV charging stations with ease.</li>
                <li>Book and manage charging slots in real-time.</li>
                <li>Get detailed bunk info including address, map, and available slots.</li>
                <li>Admin tools to add, manage, and monitor EV recharge bunks.</li>
                <li>Modern interface with responsive and dark mode support.</li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">Our Vision</h2>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-200">
                At EV Recharge Hub, we believe the future of transportation is electric. We're committed to supporting the transition to sustainable energy by building a platform that is simple, efficient, and accessible for everyone—from EV owners to recharge station operators.
              </p>
            </div>
          </div>

          {/* Enhanced Technologies Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">Technologies We Power Our Platform With</h2>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <span className="bg-blue-100 dark:bg-blue-800 px-5 py-2 rounded-full font-semibold text-blue-800 dark:text-blue-200 shadow-md">React.js</span>
              <span className="bg-green-100 dark:bg-green-800 px-5 py-2 rounded-full font-semibold text-green-800 dark:text-green-200 shadow-md">Node.js</span>
              <span className="bg-yellow-100 dark:bg-yellow-800 px-5 py-2 rounded-full font-semibold text-yellow-800 dark:text-yellow-200 shadow-md">MongoDB</span>
              <span className="bg-purple-100 dark:bg-purple-800 px-5 py-2 rounded-full font-semibold text-purple-800 dark:text-purple-200 shadow-md">Tailwind CSS</span>
              <span className="bg-pink-100 dark:bg-pink-800 px-5 py-2 rounded-full font-semibold text-pink-800 dark:text-pink-200 shadow-md">Firebase</span>
              <span className="bg-gray-200 dark:bg-gray-700 px-5 py-2 rounded-full font-semibold text-gray-700 dark:text-gray-200 shadow-md">JWT Auth</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;