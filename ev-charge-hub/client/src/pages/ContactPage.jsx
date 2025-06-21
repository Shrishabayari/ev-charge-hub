import React, { useState } from "react";
import Navbar from "../components/common/navbars/Navbar";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(""); // State to manage submission status

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending"); // Set status to indicate submission is in progress

    // *** THIS IS THE ONLY LINE YOU NEED TO CHANGE ***
    // Use the Formspree URL you provided
    const formUrl = "https://formspree.io/f/xblgewvr"; 

    try {
      const response = await fetch(formUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        alert("Thank you for contacting us! We'll get back to you shortly.");
        setFormData({ name: "", email: "", message: "" }); // Clear form after success
      } else {
        const data = await response.json();
        console.error("Formspree error:", data);
        setStatus("error");
        alert("Oops! There was an issue sending your message. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setStatus("error");
      alert("Oops! A network error occurred. Please check your connection and try again.");
    }
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
                <a href="mailto:support@vrechargehub.com" className="text-blue-600 dark:text-blue-300 hover:underline text-lg">support@evrechargehub.com</a>
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
                placeholder="Your Name"
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
                placeholder="youremail@gmail.com"
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
              disabled={status === "sending"} // Disable button during submission
              className={`w-full text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform ${
                status === "sending"
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
              } focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
            {status === "success" && (
              <p className="text-green-600 dark:text-green-400 mt-2 text-center">Message sent successfully!</p>
            )}
            {status === "error" && (
              <p className="text-red-600 dark:text-red-400 mt-2 text-center">Error sending message. Please try again.</p>
            )}
          </form>
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

export default Contact;