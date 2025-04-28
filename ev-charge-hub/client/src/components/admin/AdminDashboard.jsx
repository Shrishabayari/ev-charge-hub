import React from "react";
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleAddEvBunk = () => {
    navigate("/admin/add-ev-bunk");
  };

  const handleViewEvBunks = () => {
    navigate("/admin/view-bunks");
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>

      <div className="flex flex-col items-center gap-6">
        <button
          onClick={handleAddEvBunk}
          className="w-60 py-3 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-md"
        >
          Add New EV Bunk
        </button>

        <button
          onClick={handleViewEvBunks}
          className="w-60 py-3 px-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-md"
        >
          View EV Bunks
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
