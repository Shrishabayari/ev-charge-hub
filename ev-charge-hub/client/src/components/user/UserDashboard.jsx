import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/user/login'); // redirect if not logged in
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
    navigate('/user/bookings');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Hi, {user?.name || 'User'} 👋
        </h1>
        <div className="space-y-4">
          <button
            onClick={goToBookSlot}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            Book Slot
          </button>
          <button
            onClick={goToMyBookings}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
          >
            View My Bookings
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
