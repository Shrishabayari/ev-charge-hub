import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import Home from './components/home';  // Make sure this is correct
 import AdminLogin from './components/admin/AdminLogin'; // Admin login page
 import AdminRegister from './components/admin/AdminRegister'; // Admin dashboard page
 import AdminDashboard from './components/admin/AdminDashboard';
 import AddEvBunk from './components/admin/AddEvBunk'; // Adjust path accordingly
 import ViewBunks from './components/admin/ViewBunks'; // <- New page
 import EditEvBunk from './components/admin/EditEvBunk';
 import AdminBookingsPage from './components/admin/AdminBookingsPage';
 import MyBookingsPage from './components/admin/MyBookings';
import BookingPage from './components/admin/BookingPage';
import Login from './components/user/UserLogin';
import Register from './components/user/UserRegister';
import UserDashboard from './components/user/UserDashboard';
 import WebSocketComponent from './components/admin/WebSocket';
 

 const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  {/* This should render the Home component */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path='/admin/dashboard' element={<AdminDashboard/>} />
        <Route path="/admin/add-ev-bunk" element={<AddEvBunk />} />
        <Route path="/admin/view-bunks" element={<ViewBunks />} />
        <Route path="/admin/edit-bunk/:id" element={<EditEvBunk />} />
        <Route path="/admin/view-booking-slots" element={<BookingPage />} />
        <Route path="/admin/admin-bookings" element={<AdminBookingsPage />} />
        <Route path="/admin/my-bookings" element={<MyBookingsPage />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />

        <Route element={<WebSocketComponent />} />
      </Routes>
    </Router>
  );
};

export default App;