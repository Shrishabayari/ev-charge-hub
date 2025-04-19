import { BrowserRouter, Routes, Route } from "react-router-dom";

// Admin Pages
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import ManageSlots from "./pages/Admin/ManageSlots";

// User Pages
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/User/Home";
import SearchBunk from "./pages/User/SearchBunk";
import ViewSlot from "./pages/User/ViewSlot";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="login" element={<AdminLogin />} />
          <Route path="manage-slots" element={<ManageSlots />} />
        </Route>

        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchBunk />} />
          <Route path="view-slot/:id" element={<ViewSlot />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
