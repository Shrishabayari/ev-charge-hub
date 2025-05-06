import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Layers,
  CreditCard,
  BarChart2
} from 'lucide-react';

/**
 * Admin Layout Component
 * 
 * Provides consistent layout structure for all admin pages with:
 * - Responsive sidebar navigation
 * - Top header with user info and logout
 * - Content area for child components
 */
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Navigation items for the sidebar
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Bunks', href: '/admin/bunks', icon: Layers },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Reports', href: '/admin/reports', icon: BarChart2 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  // Check if a navigation item is currently active
  const isActive = (path) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`md:hidden ${sidebarOpen ? 'fixed inset-0 flex z-40' : 'hidden'}`}>
        {/* Overlay */}
        <div 
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`} 
          onClick={() => setSidebarOpen(false)}
        />
        
        {/* Sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-indigo-700">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <img className="h-8 w-auto" src="/logo-white.svg" alt="Bunk Admin" />
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-indigo-800 text-white'
                      : 'text-white hover:bg-indigo-600'
                  }`}
                >
                  <item.icon 
                    className={`mr-4 h-6 w-6 ${
                      isActive(item.href) ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                    }`} 
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
            <Link to="/logout" className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-base font-medium text-white">Logout</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-indigo-700">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <img className="h-8 w-auto" src="/logo-white.svg" alt="Bunk Admin" />
                <span className="ml-2 text-white font-bold text-lg">Bunk Admin</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-indigo-800 text-white'
                        : 'text-white hover:bg-indigo-600'
                    }`}
                  >
                    <item.icon 
                      className={`mr-3 h-5 w-5 ${
                        isActive(item.href) ? 'text-white' : 'text-indigo-300 group-hover:text-white'
                      }`} 
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
              <Link to="/logout" className="flex items-center text-white group">
                <LogOut className="mr-3 h-5 w-5 text-indigo-300 group-hover:text-white" />
                <span className="text-sm font-medium group-hover:text-white">Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="md:hidden px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              {/* Search could go here if needed */}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* User profile dropdown would go here */}
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">A</span>
                </div>
                <span className="ml-2 text-gray-700 text-sm font-medium">Admin User</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;