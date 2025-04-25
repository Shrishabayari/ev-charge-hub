import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import Home from './components/home';  // Make sure this is correct
 import AdminLogin from './components/admin/AdminLogin'; // Admin login page
 import AdminRegister from './components/admin/AdminRegister'; // Admin dashboard page
 import AdminDashboard from './components/admin/AdminDashboard';
 import AddEvBunk from './components/admin/AddEvBunk'; // Adjust path accordingly


 const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  {/* This should render the Home component */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path='/admin/dashboard' element={<AdminDashboard/>} />
        <Route path="/admin/add-ev-bunk" component={<AddEvBunk/>} />
        {/* More routes */}
      </Routes>
    </Router>
  );
};

export default App;