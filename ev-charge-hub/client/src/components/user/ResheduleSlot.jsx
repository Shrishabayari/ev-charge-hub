import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

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
        // Replace with your actual API call
        const res = await fetch(`/api/bookings/available-slots/${booking.bunkId._id}/${selectedDate}`);
        const data = await res.json();
        setAvailableSlots(data.data.availableSlots || []);
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setMessage({ text: "Failed to load available slots", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableSlots();
  }, [selectedDate, booking]);

  const handleSubmit = async () => {
    if (!selectedSlot) {
      setMessage({ text: "Please select a new time slot", type: "error" });
      return;
    }
    
    setLoading(true);
    try {
      // First check if slot is still available
      const checkRes = await fetch("/api/bookings/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bunkId: booking.bunkId._id,
          slotTime: selectedSlot
        })
      });
      const checkData = await checkRes.json();
      
      if (!checkData.data.available) {
        setMessage({ text: "Sorry, this slot was just booked. Please select another.", type: "error" });
        return;
      }
      
      // If available, reschedule the booking
      const response = await fetch(`/api/bookings/reschedule/${booking._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ slotTime: selectedSlot })
      });
      const data = await response.json();
      
      setMessage({ text: "Booking rescheduled successfully!", type: "success" });
      
      // Notify parent component of successful reschedule
      if (onRescheduleSuccess && typeof onRescheduleSuccess === 'function') {
        onRescheduleSuccess(data.data);
      }
      
    } catch (err) {
      console.error("Reschedule error:", err);
      setMessage({ 
        text: "Reschedule failed. Please try again.", 
        type: "error" 
      });
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
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Calendar className="w-6 h-6" />
          Reschedule Booking
        </h2>
        <p className="text-blue-100 mt-1">Select a new date and time for your booking</p>
      </div>

      <div className="p-8">
        {/* Current Booking Info */}
        <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">Current Booking</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {booking?.bunkId?.name || 'Loading...'}
              </h3>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{booking?.bunkId?.location || 'Unknown location'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium text-blue-600">{getCurrentBookingTime()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Date Selection */}
          <div className="space-y-3">
            <label htmlFor="date" className="block text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Select New Date
            </label>
            <div className="relative">
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wide">
                Select New Time Slot
              </label>
              
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mr-3" />
                  Loading available slots...
                </div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={slot?.id || slot?.time || slot || index}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                        selectedSlot === slot
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                          : 'bg-white border-gray-200 text-gray-800 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <Clock className={`w-4 h-4 mr-2 ${
                          selectedSlot === slot ? 'text-white' : 'text-gray-500'
                        }`} />
                        <span className="font-medium">{formatTimeSlot(slot)}</span>
                      </div>
                      {selectedSlot === slot && (
                        <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-white bg-blue-600 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No available slots for this date</p>
                  <p className="text-gray-400 text-sm mt-1">Please try selecting a different date</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-4 px-6 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !selectedSlot}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                loading || !selectedSlot
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                'Reschedule Booking'
              )}
            </button>
          </div>

          {/* Status Message */}
          {message.text && (
            <div className={`p-4 rounded-xl border-l-4 ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-400 text-green-800' 
                : 'bg-red-50 border-red-400 text-red-800'
            }`}>
              <div className="flex items-center">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-3 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RescheduleBookingForm;