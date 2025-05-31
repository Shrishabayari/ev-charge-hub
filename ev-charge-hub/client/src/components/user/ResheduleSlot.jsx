import React, { useState, useEffect } from "react";
import axios from "axios";

const RescheduleBookingForm = ({ booking, onRescheduleSuccess, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Set default date to booking date when component mounts
  useEffect(() => {
    if (booking && booking.startTime) {
      const bookingDate = new Date(booking.startTime);
      setSelectedDate(bookingDate.toISOString().split('T')[0]);
    }
  }, [booking]);

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!booking || !booking.bunkId || !booking.bunkId._id || !selectedDate) return;
      
      setLoading(true);
      try {
        const res = await axios.get(`/api/bookings/available-slots/${booking.bunkId._id}/${selectedDate}`);
        setAvailableSlots(res.data.data.availableSlots || []);
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setMessage({ text: "Failed to load available slots", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableSlots();
  }, [selectedDate, booking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      setMessage({ text: "Please select a new time slot", type: "error" });
      return;
    }
    
    setLoading(true);
    try {
      // First check if slot is still available
      const checkRes = await axios.post("/api/bookings/check-availability", {
        bunkId: booking.bunkId._id,
        slotTime: selectedSlot
      });
      
      if (!checkRes.data.data.available) {
        setMessage({ text: "Sorry, this slot was just booked. Please select another.", type: "error" });
        return;
      }
      
      // If available, reschedule the booking
      const response = await axios.put(`/api/bookings/reschedule/${booking._id}`, {
        slotTime: selectedSlot
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      
      setMessage({ text: "Booking rescheduled successfully!", type: "success" });
      
      // Notify parent component of successful reschedule
      if (onRescheduleSuccess && typeof onRescheduleSuccess === 'function') {
        onRescheduleSuccess(response.data.data);
      }
      
    } catch (err) {
      console.error("Reschedule error:", err);
      
      if (err.response?.status === 401) {
        setMessage({ text: "Please log in to reschedule", type: "error" });
      } else {
        setMessage({ 
          text: err.response?.data?.message || "Reschedule failed", 
          type: "error" 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Enhanced function to format time slots as ranges
  const formatTimeSlot = (slotData) => {
    if (!slotData) return "";
    
    let startTime, endTime;
    
    // Handle different slot data formats
    if (typeof slotData === 'string') {
      // If it's an ISO string
      if (slotData.includes('T')) {
        startTime = new Date(slotData);
        // Assume 1-hour duration if no end time provided
        endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
      } 
      // If it's just time like "14:30"
      else if (slotData.includes(':')) {
        const [hours, minutes] = slotData.split(':');
        const today = new Date();
        startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes));
        endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
      }
    } 
    // If it's an object with start and end times
    else if (typeof slotData === 'object') {
      if (slotData.startTime && slotData.endTime) {
        startTime = new Date(slotData.startTime);
        endTime = new Date(slotData.endTime);
      } else if (slotData.time) {
        startTime = new Date(slotData.time);
        endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
      }
    }
    
    if (!startTime || !endTime) {
      console.warn('Could not parse slot time:', slotData);
      return String(slotData);
    }
    
    const formatTime = (date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour = hours % 12 || 12;
      
      // Only show minutes if they're not 00
      if (minutes === 0) {
        return `${hour} ${ampm}`;
      } else {
        return `${hour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }
    };
    
    const startFormatted = formatTime(startTime);
    const endFormatted = formatTime(endTime);
    
    // If both times have the same AM/PM, show it only once
    const startAMPM = startTime.getHours() >= 12 ? 'PM' : 'AM';
    const endAMPM = endTime.getHours() >= 12 ? 'PM' : 'AM';
    
    if (startAMPM === endAMPM) {
      const startWithoutAMPM = startFormatted.replace(` ${startAMPM}`, '');
      return `${startWithoutAMPM} - ${endFormatted}`;
    } else {
      return `${startFormatted} - ${endFormatted}`;
    }
  };

  // Format the current booking time for display
  const getCurrentBookingTime = () => {
    if (!booking || !booking.startTime) return "";
    
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);
    
    const formatTime = (date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour = hours % 12 || 12;
      
      if (minutes === 0) {
        return `${hour} ${ampm}`;
      } else {
        return `${hour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }
    };
    
    const startFormatted = formatTime(startTime);
    const endFormatted = formatTime(endTime);
    
    // If both times have the same AM/PM, show it only once
    const startAMPM = startTime.getHours() >= 12 ? 'PM' : 'AM';
    const endAMPM = endTime.getHours() >= 12 ? 'PM' : 'AM';
    
    if (startAMPM === endAMPM) {
      const startWithoutAMPM = startFormatted.replace(` ${startAMPM}`, '');
      return `${startWithoutAMPM} - ${endFormatted}`;
    } else {
      return `${startFormatted} - ${endFormatted}`;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Reschedule Booking</h2>
      
      {/* Current Booking Info */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">Current Booking:</p>
        <p className="font-medium">{booking?.bunkId?.name || 'Loading...'}</p>
        <p>{booking?.bunkId?.location || 'Unknown location'}</p>
        <p className="text-blue-600 font-medium">{getCurrentBookingTime()}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Selection */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Select New Date
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
        {selectedDate && (
          <div>
            <label htmlFor="slot" className="block text-sm font-medium text-gray-700">
              Select New Time Slot
            </label>
            
            {loading ? (
              <div className="text-center py-4">Loading available slots...</div>
            ) : availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableSlots.map((slot, index) => (
                  <button
                    key={slot?.id || slot?.time || slot || index}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 px-4 text-sm rounded border text-left ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {formatTimeSlot(slot)}
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
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !selectedSlot}
            className={`flex-1 py-2 px-4 rounded text-white ${
              loading || !selectedSlot
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : 'Reschedule'}
          </button>
        </div>
        
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

export default RescheduleBookingForm;