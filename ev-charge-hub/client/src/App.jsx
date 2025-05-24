import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import Home from './components/home';  // Make sure this is correct
 import AdminLogin from './components/admin/AdminLogin'; // Admin login page
 import AdminRegister from './components/admin/AdminRegister'; // Admin dashboard page
 import AdminDashboard from './components/admin/AdminDashboard';
 import AddEvBunk from './components/admin/AddEvBunk'; // Adjust path accordingly
 import ViewBunks from './components/admin/ViewBunks'; // <- New page
 import EditEvBunk from './components/admin/EditEvBunk';
import Login from './components/user/UserLogin';
import Register from './components/user/UserRegister';
import UserDashboard from './components/user/UserDashboard';
import BookSlot from './components/user/BookSlot';
 import WebSocketComponent from './components/admin/WebSocket';
 import NewBooking from './pages/user/NewBooking';
import MyBookings from './pages/user/MyBooking';
import AdminBookings from './components/admin/BookingManagement';
import BookingsList from './components/user/BookingList';
import RescheduleBookingForm from './components/user/ResheduleSlot';
import AdminBookingDetail from './components/admin/AdminBookingDetails';
import AdminBookingsList from './components/admin/AdminBookingList';
import EvBunkAdminMap from './components/admin/EvBunkMapView';

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
        <Route path='/admin/booking-management' element={<AdminBookings/>} />
        <Route path="/admin/edit-bunk/:id" element={<EditEvBunk />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/book-slot" element={<BookSlot/>} />
        <Route path='/user/bookings/new' element={<NewBooking/>} />
        <Route path='/user/bookings/my' element={<MyBookings/>} />
        <Route path='/user/bookings/list' element={<BookingsList/>} />
        <Route path='/user/bookings/reshedule' element={<RescheduleBookingForm/>} />
        <Route path='/admin/booking/list' element={<AdminBookingsList/>} />
        <Route path='/admin/bookings/:id' element={<AdminBookingDetail/>} />
        <Route path='/admin/bunk' element={<EvBunkAdminMap/>} />
        <Route element={<WebSocketComponent />} />
      </Routes>
    </Router>
  );
};

export default App;