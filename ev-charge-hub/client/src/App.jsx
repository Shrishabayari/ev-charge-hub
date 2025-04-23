import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/admin/Home';  // Make sure this is correct
import AdminLogin from './components/admin/AdminLogin'; // Admin login page
import AdminRegister from './components/admin/AdminRegister'; // Admin dashboard page
import ForgotPassword from './components/admin/ForgotPassword';
import ResetPassword from './components/admin/ResetPassword';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  {/* This should render the Home component */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password/:token" element={<ResetPassword />} />      </Routes>
    </Router>
  );
};

export default App;
