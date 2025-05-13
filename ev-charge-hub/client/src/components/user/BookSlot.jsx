import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingForm = () => {
  const [bunks, setBunks] = useState([]);
  const [selectedBunk, setSelectedBunk] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch all bunks on component mount
  useEffect(() => {
    const fetchBunks = async () => {
      try {
        const res = await axios.get("/api/bunks");
        setBunks(res.data.data || []);
      } catch (err) {
        console.error("Error fetching bunks:", err);
        setMessage({ text: "Failed to load EV bunks", type: "error" });
      }
    };
    
    fetchBunks();
  }, []);

  // Fetch available slots when bunk or date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedBunk || !selectedDate) return;
      
      setLoading(true);
      try {
        console.log(`Fetching slots for bunk ${selectedBunk} on ${selectedDate}`);
        
        const res = await axios.get(`/api/bookings/available-slots/${selectedBunk}/${selectedDate}`);
        console.log("API response:", res.data);
        
        // Check the exact structure of the response and adjust accordingly
        const slots = res.data.data?.availableSlots || [];
        console.log(`Received ${slots.length} available slots`);
        
        setAvailableSlots(slots);
        setSelectedSlot(""); // Reset selected slot
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setMessage({ text: "Failed to load available slots", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableSlots();
  }, [selectedBunk, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBunk || !selectedSlot) {
      setMessage({ text: "Please select a bunk and time slot", type: "error" });
      return;
    }
    
    setLoading(true);
    try {
      // First check if slot is still available
      const checkRes = await axios.post("/api/bookings/check-availability", {
        bunkId: selectedBunk,
        slotTime: selectedSlot
      });
      
      if (!checkRes.data.data.available) {
        setMessage({ text: "Sorry, this slot was just booked. Please select another.", type: "error" });
        return;
      }
      
      // If available, create the booking
      await axios.post("/api/bookings/create", {
        bunkId: selectedBunk,
        slotTime: selectedSlot
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      setMessage({ text: "Slot booked successfully!", type: "success" });
      
      // Reset form
      setSelectedSlot("");
      
      // Refresh available slots
      const res = await axios.get(`/api/bookings/available-slots/${selectedBunk}/${selectedDate}`);
      setAvailableSlots(res.data.data.availableSlots || []);
      
    } catch (err) {
      console.error("Booking error:", err);
      
      if (err.response?.status === 401) {
        setMessage({ text: "Please log in to book a slot", type: "error" });
      } else {
        setMessage({ text: err.response?.data?.message || "Booking failed", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  // Format time for display (e.g. "14:30" -> "2:30 PM")
  const formatTimeForDisplay = (isoString) => {
    if (!isoString) return "";
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) return "";
    
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Book EV Charging Slot</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bunk Selection */}
        <div>
          <label htmlFor="bunk" className="block text-sm font-medium text-gray-700">
            Select EV Bunk
          </label>
          <select
            id="bunk"
            value={selectedBunk}
            onChange={(e) => setSelectedBunk(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            required
          >
            <option value="">Select EV Bunk</option>
            {bunks.map(bunk => (
              <option key={bunk._id} value={bunk._id}>
                {bunk.name} - {bunk.address}
              </option>
            ))}
          </select>
        </div>
        
        {/* Date Selection */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Select Date
          </label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
            required
          />
        </div>
        
        {/* Time Slot Selection */}
        {selectedBunk && selectedDate && (
          <div>
            <label htmlFor="slot" className="block text-sm font-medium text-gray-700">
              Select Time Slot
            </label>
            
            {loading ? (
              <div className="text-center py-4">Loading available slots...</div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-3 text-sm rounded border ${
                      selectedSlot === slot
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {formatTimeForDisplay(slot)}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No available slots for this date
              </div>
            )}
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedSlot}
          className={`w-full py-2 rounded text-white ${
            loading || !selectedSlot
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? 'Processing...' : 'Book Slot'}
        </button>
        
        {/* Status Message */}
        {message.text && (
          <div className={`text-center p-2 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default BookingForm;