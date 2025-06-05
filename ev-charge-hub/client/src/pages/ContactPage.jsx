import React, { useState } from "react";
import Navbar from "../components/common/navbars/Navbar";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted contact form:", formData);
    alert("Thank you for contacting us! We'll get back to you shortly."); // More professional alert message
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div>
      <Navbar />
      <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-16 px-6 md:px-20 flex items-center justify-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 bg-gray-50 dark:bg-gray-800 p-8 md:p-12 rounded-xl shadow-2xl">
          {/* Left Column: Contact Information */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 leading-tight">
                Get in Touch
              </h1>
              <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
                Have questions, suggestions, or need support? We're here to help you connect with the future of EV charging. Feel free to reach out to us!
              </p>
            </div>

            <div className="space-y-6 mt-8">
              {/* Contact Info Blocks (without icons) */}
              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Email Us</h3>
                <a href="mailto:support@vrechargehub.com" className="text-blue-600 dark:text-blue-300 hover:underline text-lg">support@vrechargehub.com</a>
              </div>

              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Call Us</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">+91-9876543210</p>
              </div>

              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md border border-gray-100 dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Our Location</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300">Udupi, Karnataka, India</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <form onSubmit={handleSubmit} className="grid gap-6 p-6 md:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition duration-200"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition duration-200"
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                required
                className="w-full px-5 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-y transition duration-200"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;