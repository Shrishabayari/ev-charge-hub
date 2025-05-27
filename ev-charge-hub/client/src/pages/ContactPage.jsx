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
    alert("Thank you for contacting us!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div>
        <Navbar/>
        <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-12 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">Contact Us</h1>

            <p className="mb-8 text-lg">
            Have questions, suggestions, or need support? We'd love to hear from you. Fill out the form below and our team will get back to you soon.
            </p>

            <form onSubmit={handleSubmit} className="grid gap-6 bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <div>
                <label className="block text-sm mb-1" htmlFor="name">Name</label>
                <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm mb-1" htmlFor="email">Email</label>
                <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm mb-1" htmlFor="message">Message</label>
                <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
                className="w-full px-4 py-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition duration-200"
            >
                Send Message
            </button>
            </form>

            <div className="mt-10 text-sm text-gray-600 dark:text-gray-400">
            <p>Email: <a href="mailto:support@vrechargehub.com" className="text-blue-500 hover:underline">support@vrechargehub.com</a></p>
            <p>Phone: +91-9876543210</p>
            <p>Location: Udupi, Karnataka, India</p>
            </div>
        </div>
        </section>
    </div>
  );
};

export default Contact;
