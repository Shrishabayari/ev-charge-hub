import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserNavbar from '../common/navbars/UserNavbar';

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

  const goToBookSlot = () => {
    navigate('/user/book-slot');
  };

  const goToMyBookings = () => {
    navigate('/user/view-my-bookings');
  };

  const goToLocations = () => {
    navigate('/user/view-bunk-locations');
  };

  const goToMyProfile = () => {
    navigate('/user/my-profile');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <UserNavbar />
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-10">
            Welcome, <span className="text-blue-600 dark:text-blue-400">{user?.name || 'User'} 👋</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={goToBookSlot}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl text-base font-semibold transition-colors"
            >
              Book Slot
            </button>
            <button
              onClick={goToMyBookings}
              className="bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl text-base font-semibold transition-colors"
            >
              View My Bookings
            </button>
            <button
              onClick={goToLocations}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl text-base font-semibold transition-colors"
            >
              View Bunk Locations
            </button>
            <button
              onClick={goToMyProfile}
              className="bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-xl text-base font-semibold transition-colors"
            >
              My Profile
            </button>
            <button
              onClick={handleLogout}
              className="col-span-1 sm:col-span-2 bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl text-base font-semibold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
