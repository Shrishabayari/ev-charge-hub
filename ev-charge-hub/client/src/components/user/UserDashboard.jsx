import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../common/navbars/UserNavbar';
import { Zap, CalendarCheck, MapPin, User, LogOut } from 'lucide-react'; // Importing relevant icons
import Footer from "../common/Footer";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/user/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/user/login');
  };

  // Array of dashboard items with their details, similar to AdminDashboard
  const dashboardItems = [
    {
      title: "Book a Charging Slot",
      description: "Find and reserve a charging slot at your preferred EV bunk.",
      icon: <Zap className="w-10 h-10 text-blue-600 group-hover:text transition-colors duration-300" />,
      bgColor: "bg-blue-50",
      hoverBg: "bg-blue-600",
      textColor: "text-blue-800",
      path: "/user/book-slot",
      action: () => navigate('/user/book-slot'),
    },
    {
      title: "My Bookings",
      description: "View your past, current, and upcoming charging reservations.",
      icon: <CalendarCheck className="w-10 h-10 text-green-600 group-hover:text transition-colors duration-300" />,
      bgColor: "bg-green-50",
      hoverBg: "bg-green-600",
      textColor: "text-green-800",
      path: "/user/view-my-bookings",
      action: () => navigate('/user/view-my-bookings'),
    },
    {
      title: "Bunk Locations",
      description: "Explore all available EV charging station locations.",
      icon: <MapPin className="w-10 h-10 text-purple-600 group-hover:text transition-colors duration-300" />,
      bgColor: "bg-purple-50",
      hoverBg: "bg-purple-300",
      textColor: "text-purple-800",
      path: "/user/view-bunk-locations",
      action: () => navigate('/user/view-bunk-locations'),
    },
    {
      title: "My Profile",
      description: "Update your personal information and account settings.",
      icon: <User className="w-10 h-10 text-yellow-600 group-hover:text transition-colors duration-300" />,
      bgColor: "bg-yellow-50",
      hoverBg: "bg-yellow-600",
      textColor: "text-yellow-800",
      path: "/user/my-profile",
      action: () => navigate('/user/my-profile'),
    },
    {
      title: "Logout",
      description: "Securely sign out from your account.",
      icon: <LogOut className="w-10 h-10 text-red-600 group-hover:text transition-colors duration-300" />,
      bgColor: "bg-red-50",
      hoverBg: "bg-red-600",
      textColor: "text-red-800",
      path: "#", // No specific route, handled by action
      action: handleLogout, // Direct call to logout handler
    },
  
  ];

  return (
    <div>
      <UserNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-10 lg:p-12">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8 lg:p-10">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 lg:text-5xl">
              Welcome, <span className="text-blue-600">{user?.name || 'User'} 👋</span>
            </h1>
            <p className="text-xl text-gray-600 lg:text-2xl">
              Your personal dashboard for managing EV charging.
            </p>
          </div>

          {/* Grid of Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {dashboardItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action} // Use the action defined in the item
                className={`group flex flex-col items-center text-center p-8 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                  ${item.bgColor} hover:${item.hoverBg}
                  border border-gray-100 hover:border-transparent
                `}
              >
                <div className="mb-4">
                  {item.icon}
                </div>
                {/* Removed transition-colors from h2 and p to prevent blur */}
                <h2 className={`text-2xl font-bold mb-2 group-hover:text ${item.textColor}`}>
                  {item.title}
                </h2>
                <p className="text-gray-600 group-hover:text text-base">
                  {item.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div><Footer/>
    </div>
  );
}
