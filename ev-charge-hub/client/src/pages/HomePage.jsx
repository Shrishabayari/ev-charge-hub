import { Link } from "react-router-dom";
import Navbar from "../components/common/navbars/Navbar";
const Home = () => {
  return (
    <div>
      <Navbar/>
      <main className="dark:bg-gray-900 dark:text-white text-gray-800">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-700 py-20 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Power Your Journey with <span className="text-blue-600 dark:text-blue-400">EV Charge Hub</span>
              </h1>
              <p className="text-lg md:text-xl mb-6">
                Locate, Book, and Recharge at your nearest EV Station. Easy. Fast. Smart.
              </p>
              <div className="flex gap-4">
                <Link to="/login/user" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                  Get Started
                </Link>
                <Link to="/how-it-works" className="border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100 dark:hover:bg-gray-800 transition">
                  How It Works
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <img
                src="https://img.freepik.com/free-vector/electric-car-concept-illustration_114360-8227.jpg"
                alt="EV Charging"
                className="rounded-xl shadow-xl w-full"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-10">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-3">Live Station Map</h3>
                <p>Find the closest EV recharge station with real-time availability and directions.</p>
              </div>
              <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-3">Easy Slot Booking</h3>
                <p>Book a time slot instantly and avoid long waits with our seamless scheduling system.</p>
              </div>
              <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-3">User & Admin Panels</h3>
                <p>Dedicated dashboards for users and admins to manage everything with ease.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Recharge Smarter?</h2>
          <p className="mb-8 text-lg">Join V Recharge Hub and make your EV charging experience effortless and efficient.</p>
          <Link to="/login/user" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition">
            Sign Up Now
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Home;
