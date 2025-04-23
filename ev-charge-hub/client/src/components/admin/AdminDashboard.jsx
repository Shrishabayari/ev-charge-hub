import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [evBunkLocations, setEvBunkLocations] = useState([]);
  const token = localStorage.getItem("adminToken"); // Assuming you store the token here

  useEffect(() => {
    const fetchEvBunkLocations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/ev-bunks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvBunkLocations(response.data);
      } catch (error) {
        console.error("Error fetching EV bunk locations:", error);
        // Handle error (e.g., display an error message to the admin)
      }
    };

    if (token) {
      fetchEvBunkLocations();
    }
  }, [token]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Hi, how are you?</p>

      <h2>EV Bunk Locations</h2>
      {evBunkLocations.length > 0 ? (
        <ul>
          {evBunkLocations.map(bunk => (
            <li key={bunk._id}>
              <strong>{bunk.name}</strong>
              <p>Latitude: {bunk.latitude}, Longitude: {bunk.longitude}</p>
              {bunk.address && <p>Address: {bunk.address}</p>}
              {/* Display other relevant details */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No EV bunk locations found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;