import React, { useState, useEffect } from "react";
import api from '../../api';
import { useLocation } from "react-router-dom"; // Add this import
import { Clock, MapPin, Calendar, Zap, CheckCircle, AlertCircle } from "lucide-react";

const BookingForm = () => {
  const [bunks, setBunks] = useState([]);
  const [selectedBunk, setSelectedBunk] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [selectedBunkDetails, setSelectedBunkDetails] = useState(null);

  // Add useLocation hook to get state from navigation
  const location = useLocation();
  const preSelectedBunk = location.state?.bunk; // Get the bunk passed from map view

  // Fetch all bunks on component mount
  useEffect(() => {
    const fetchBunks = async () => {
      try {
        const res = await api.get("/api/bunks");
        setBunks(res.data);
        
        // If there's a pre-selected bunk from navigation, set it as selected
        if (preSelectedBunk && res.data) {
          setSelectedBunk(preSelectedBunk._id);
        }
      } catch (err) {
        console.error("Error fetching bunks:", err);
        setMessage({ text: "Failed to load EV bunks", type: "error" });
      }
    };
    
    fetchBunks();
  }, [preSelectedBunk]); // Add preSelectedBunk as dependency

  // Update selected bunk details when bunk changes
  useEffect(() => {
    if (selectedBunk) {
      const bunkDetails = bunks.find(bunk => bunk._id === selectedBunk);
      setSelectedBunkDetails(bunkDetails);
    } else {
      setSelectedBunkDetails(null);
    }
  }, [selectedBunk, bunks]);

  // Fetch available slots when bunk or date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedBunk || !selectedDate) return;
      
      setLoading(true);
      try {
        const res = await api.get(`/api/bookings/available-slots/${selectedBunk}/${selectedDate}`);
        // Fix: Access the availableSlots from the correct path in the response
        setAvailableSlots(res.data.data.availableSlots || []);
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
      const checkRes = await api.post("/api/bookings/check-availability", {
        bunkId: selectedBunk,
        slotTime: selectedSlot
      });
      
      if (!checkRes.data.data.available) {
        setMessage({ text: "Sorry, this slot was just booked. Please select another.", type: "error" });
        return;
      }
      
      // If available, create the booking
      await api.post("/api/bookings/create", {
        bunkId: selectedBunk,
        slotTime: selectedSlot
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      setMessage({ text: "Slot booked successfully!", type: "success" });
      
      // Reset form
      setSelectedSlot("");
      
      // Refresh available slots
      const res = await api.get(`/api/bookings/available-slots/${selectedBunk}/${selectedDate}`);
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

  // Enhanced time formatting function that handles different slot formats
  const formatTimeSlot = (slotData) => {
    if (!slotData) return "";

    // If slotData is a string that looks like an ISO date
    if (typeof slotData === 'string' && slotData.includes('T')) {
      const date = new Date(slotData);
      const startHour = date.getHours();
      const startMinute = date.getMinutes();
      const endHour = startHour + 1; // Assuming 1-hour slots
      
      return `${formatTime(startHour, startMinute)} - ${formatTime(endHour, startMinute)}`;
    }
    
    // If slotData is an object with start and end times
    if (typeof slotData === 'object' && slotData.startTime && slotData.endTime) {
      return `${formatTimeFromString(slotData.startTime)} - ${formatTimeFromString(slotData.endTime)}`;
    }
    
    // If slotData is just a time string like "14:30"
    if (typeof slotData === 'string' && slotData.includes(':')) {
      const [hours, minutes] = slotData.split(':');
      const startHour = parseInt(hours, 1);
      const startMinute = parseInt(minutes, 1);
      const endHour = startHour + 1;
      
      return `${formatTime(startHour, startMinute)} - ${formatTime(endHour, startMinute)}`;
    }
    
    // If it's a number (hour)
    if (typeof slotData === 'number') {
      return `${formatTime(slotData, 0)} - ${formatTime(slotData + 1, 0)}`;
    }
    
    return slotData.toString();
  };

  // Helper function to format time
  const formatTime = (hours, minutes = 0) => {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    const displayMinute = minutes.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${ampm}`;
  };

  // Helper function to format time from string
  const formatTimeFromString = (timeString) => {
    if (!timeString) return "";
    
    // Handle full ISO string
    if (timeString.includes('T')) {
      const date = new Date(timeString);
      return formatTime(date.getHours(), date.getMinutes());
    }
    
    // Handle time string like "14:30"
    const [hours, minutes] = timeString.split(':');
    return formatTime(parseInt(hours, 10), parseInt(minutes, 10));
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get max date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Book Your EV Charging Slot
          </h1>
          <p className="text-gray-600">Reserve your preferred charging time slot</p>
          
          {/* Show pre-selected bunk info if available */}
          {preSelectedBunk && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Selected Station:</strong> {preSelectedBunk.name}
              </p>
            </div>
          )}
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bunk Selection */}
              <div>
                <label htmlFor="bunk" className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                  Select Charging Station
                </label>
                <select
                  id="bunk"
                  value={selectedBunk}
                  onChange={(e) => setSelectedBunk(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  required
                >
                  <option value="">Choose a charging station</option>
                  {bunks.map(bunk => (
                    <option key={bunk._id} value={bunk._id}>
                      {bunk.name} - {bunk.address || bunk.location}
                    </option>
                  ))}
                </select>
                
                {/* Bunk Details */}
                {selectedBunkDetails && (
                  <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Operating Hours: {selectedBunkDetails.operatingHours || '9:00 AM - 9:00 PM'}</span>
                      </div>
                      <div className="flex items-center text-green-600 font-medium">
                        <span>{selectedBunkDetails.slotsAvailable || 0} slots available</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Date Selection */}
              <div>
                <label htmlFor="date" className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                  <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                  Select Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  min={getTodayDate()}
                  max={getMaxDate()}
                  required
                />
              </div>
              
              {/* Time Slot Selection */}
              {selectedBunk && selectedDate && (
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    Select Time Slot
                  </label>
                  
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading available slots...</p>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={`${slot}-${index}`}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-4 text-sm font-medium rounded-xl border-2 transition-all duration-200 ${
                            selectedSlot === slot
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500 shadow-lg transform scale-105'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {formatTimeSlot(slot)}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Slots</h3>
                      <p className="text-gray-500">No charging slots available for this date. Please try another date.</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !selectedSlot}
                className={`w-full py-4 rounded-xl text-white font-semibold transition-all duration-200 ${
                  loading || !selectedSlot
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Book Charging Slot
                  </div>
                )}
              </button>
            </form>
          </div>
          
          {/* Status Message */}
          {message.text && (
            <div className={`px-8 py-4 border-t ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-100' 
                : 'bg-red-50 border-red-100'
            }`}>
              <div className={`flex items-center ${
                message.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-2">Booking Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Each slot is typically 1 hour duration</li>
            <li>• Slots are shown in your local time</li>
            <li>• You can book up to 30 days in advance</li>
            <li>• Please arrive on time for your booking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;