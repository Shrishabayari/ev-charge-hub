import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import About from './pages/AboutPage';
import Contact from './pages/ContactPage';
import HowItWorks from './pages/HowItWorksPage';
import FAQ from './pages/FAQPage';
 import AdminLogin from './components/admin/AdminLogin'; // Admin login page
 import AdminRegister from './components/admin/AdminRegister'; // Admin dashboard page
 import AdminDashboard from './components/admin/AdminDashboard';
 import AddEvBunk from './components/admin/AddEvBunk'; // Adjust path accordingly
 import ViewBunks from './components/admin/ViewBunks'; // <- New page
 import EditEvBunk from './components/admin/EditEvBunk';
import Login from './components/user/UserLogin';
import Register from './components/user/UserRegister';
import UserDashboard from './components/user/UserDashboard';
 import WebSocketComponent from './components/admin/WebSocket';
 import NewBooking from './pages/user/NewBooking';
import MyBookings from './pages/user/MyBooking';
import AdminBookings from './components/admin/BookingManagement';
import BookingsList from './components/user/BookingList';
import RescheduleBookingForm from './components/user/ResheduleSlot';
import AdminBookingDetail from './components/admin/AdminBookingDetails';
import AdminBookingsList from './components/admin/AdminBookingList';
import EvBunkAdminMap from './components/admin/EvBunkMapView';
import EvBunkAdminMaps from './components/user/EvBunkMapView';
import MyProfile from './components/user/MyProfile';
import AdminUserManagement from './components/admin/RegisteredUsers';
import AdminProfile from './components/admin/AdminProfileView';
import Features from './pages/Features';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/about" element={<About />} /> 
        <Route path="/contact" element={<Contact />} /> 
        <Route path="/how-it-works" element={<HowItWorks />} /> 
        <Route path="/faq" element={<FAQ />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path='/admin/dashboard' element={<AdminDashboard/>} />
        <Route path="/admin/add-bunk" element={<AddEvBunk />} />
        <Route path="/admin/view-bunks" element={<ViewBunks />} />
        <Route path='/admin/booking-management' element={<AdminBookings/>} />
        <Route path="/admin/edit-bunk/:id" element={<EditEvBunk />} />
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/book-slot" element={<NewBooking/>} />
        <Route path='/user/view-my-bookings' element={<MyBookings/>} />
        <Route path='/user/view-bookings' element={<BookingsList/>} />
        <Route path='/user/bookings/reshedule' element={<RescheduleBookingForm/>} />
        <Route path='/admin/view-bookings' element={<AdminBookingsList/>} />
        <Route path='/admin/bookings/:id' element={<AdminBookingDetail/>} />
        <Route path='/admin/view-bunk-locations' element={<EvBunkAdminMap/>} />
        <Route path='/user/view-bunk-locations' element={<EvBunkAdminMaps/>} />
        <Route path='/user/bookings/list' element={<BookingsList/>} />
        <Route path='/user/my-profile' element={<MyProfile/>} />
        <Route path='/admin/registered-users' element={<AdminUserManagement/>} />
        <Route path='/admin/my-profile' element={<AdminProfile/>} />
        <Route path='/why-ev-charge-hub' element={<Features/>} />
        <Route element={<WebSocketComponent />} />
      </Routes>
    </Router>
  );
};

export default App;