import React from "react";
import Navbar from "../components/common/navbars/Navbar";

const About = () => {
  return (
    <div>
        <Navbar/>
        <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-12 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-6 text-blue-600 dark:text-blue-400">About V Recharge Hub</h1>

            <p className="mb-6 text-lg leading-relaxed">
            <strong>V Recharge Hub</strong> is an innovative platform designed to streamline the electric vehicle (EV) charging experience for users and administrators alike. Our mission is to empower the future of mobility by connecting EV drivers with accessible, reliable, and smart charging stations.
            </p>

            <div className="grid md:grid-cols-2 gap-10 mt-10">
            <div>
                <h2 className="text-2xl font-semibold mb-3">Why V Recharge Hub?</h2>
                <ul className="list-disc ml-6 space-y-2 text-base">
                <li>Locate nearby EV charging stations with ease.</li>
                <li>Book and manage charging slots in real-time.</li>
                <li>Get detailed bunk info including address, map, and available slots.</li>
                <li>Admin tools to add, manage, and monitor EV recharge bunks.</li>
                <li>Modern interface with responsive and dark mode support.</li>
                </ul>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
                <p className="text-base leading-relaxed">
                At V Recharge Hub, we believe the future of transportation is electric. We're committed to supporting the transition to sustainable energy by building a platform that is simple, efficient, and accessible for everyone—from EV owners to recharge station operators.
                </p>
            </div>
            </div>

            <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-3">Technologies We Use</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-200">
                <span className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded">React.js</span>
                <span className="bg-green-100 dark:bg-green-800 px-3 py-1 rounded">Node.js</span>
                <span className="bg-yellow-100 dark:bg-yellow-800 px-3 py-1 rounded">MongoDB</span>
                <span className="bg-purple-100 dark:bg-purple-800 px-3 py-1 rounded">Tailwind CSS</span>
                <span className="bg-pink-100 dark:bg-pink-800 px-3 py-1 rounded">Firebase</span>
                <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded">JWT Auth</span>
            </div>
            </div>
        </div>
        </section>
    </div>
  );
};

export default About;
