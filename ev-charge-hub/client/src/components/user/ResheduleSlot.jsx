// RescheduleBookingForm.jsx
import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import api from '../../api';
import { useLocation } from "react-router-dom";

const RescheduleBookingForm = ({ booking, onRescheduleSuccess, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [selectedBunk, setSelectedBunk] = useState("");
  const [selectedBunkDetails, setSelectedBunkDetails] = useState(null);
  const [bunks, setBunks] = useState([]);
  const location = useLocation();
  const preSelectedBunk = location.state?.bunk;

  useEffect(() => {
    const fetchBunks = async () => {
      try {
        const res = await api.get("/api/bunks");
        setBunks(res.data);
        if (preSelectedBunk && res.data) {
          setSelectedBunk(preSelectedBunk._id);
        } else if (booking?.bunkId?._id) {
          setSelectedBunk(booking.bunkId._id);
        }
      } catch (err) {
        setMessage({ text: "Failed to load EV bunks", type: "error" });
      }
    };
    fetchBunks();
  }, [preSelectedBunk, booking]);

  useEffect(() => {
    if (selectedBunk) {
      const bunkDetails = bunks.find(bunk => bunk._id === selectedBunk);
      setSelectedBunkDetails(bunkDetails);
    } else {
      setSelectedBunkDetails(null);
    }
  }, [selectedBunk, bunks]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedBunk || !selectedDate) {
        setAvailableSlots([]);
        return;
      }

      setLoading(true);
      setMessage({ text: "", type: "" });

      try {
        const res = await api.get(`/api/bookings/available-slots/${selectedBunk}/${selectedDate}`);
        const slots = res.data.data?.availableSlots || res.data.availableSlots || [];
        setAvailableSlots(slots);
        setSelectedSlot("");
        if (slots.length === 0) {
          setMessage({ text: "No available slots for this date", type: "info" });
        }
      } catch (err) {
        setAvailableSlots([]);
        setMessage({
          text: err.response?.data?.message || "Failed to load available slots",
          type: "error"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableSlots();
  }, [selectedBunk, selectedDate]);

  const handleReschedule = async (e) => {
    e.preventDefault();

    if (!selectedBunk || !selectedSlot || !selectedDate) {
      setMessage({ text: "Please select a bunk, date, and time slot", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const checkRes = await api.post("/api/bookings/check-availability", {
        bunkId: selectedBunk,
        slotTime: selectedSlot
      });

      if (!checkRes.data.data?.available) {
        setMessage({ text: "Sorry, this slot was just booked. Please select another.", type: "error" });
        const res = await api.get(`/api/bookings/available-slots/${selectedBunk}/${selectedDate}`);
        setAvailableSlots(res.data.data?.availableSlots || []);
        return;
      }

      let startTime, endTime;
      if (typeof selectedSlot === 'object') {
        startTime = selectedSlot.startTime || selectedSlot.time;
        endTime = selectedSlot.endTime || new Date(new Date(`${selectedDate}T${startTime}`).getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5);
      } else if (typeof selectedSlot === 'string') {
        if (selectedSlot.includes('T')) {
          const slotDate = new Date(selectedSlot);
          startTime = slotDate.toTimeString().slice(0, 5);
          const endDate = new Date(slotDate.getTime() + 60 * 60 * 1000);
          endTime = endDate.toTimeString().slice(0, 5);
        } else if (selectedSlot.includes(':')) {
          startTime = selectedSlot;
          const [hours, minutes] = selectedSlot.split(':');
          const endHour = parseInt(hours) + 1;
          endTime = `${endHour.toString().padStart(2, '0')}:${minutes}`;
        } else {
          startTime = selectedSlot;
          endTime = selectedSlot;
        }
      } else {
        startTime = `${selectedSlot.toString().padStart(2, '0')}:00`;
        endTime = `${(selectedSlot + 1).toString().padStart(2, '0')}:00`;
      }

      // ✅ Timezone fix: manual UTC conversion
      const localStart = new Date(`${selectedDate}T${startTime}`);
      const localEnd = new Date(`${selectedDate}T${endTime}`);
      const startDateTime = new Date(localStart.getTime() - localStart.getTimezoneOffset() * 60000);
      const endDateTime = new Date(localEnd.getTime() - localEnd.getTimezoneOffset() * 60000);

      const rescheduleData = {
        newBunkId: selectedBunk,
        newDate: selectedDate,
        newSlot: selectedSlot,
        newSlotTime: startTime,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        newStartTime: startDateTime.toISOString(),
        newEndTime: endDateTime.toISOString()
      };

      const res = await api.put(`/api/bookings/reschedule/${booking._id}`, rescheduleData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage({ text: "Booking rescheduled successfully!", type: "success" });

      if (onRescheduleSuccess) {
        onRescheduleSuccess(res.data);
      }

      setTimeout(() => {
        setSelectedSlot("");
        setSelectedDate("");
      }, 2000);

    } catch (err) {
      if (err.response?.status === 401) {
        setMessage({ text: "Please log in to reschedule booking", type: "error" });
      } else if (err.response?.status === 404) {
        setMessage({ text: "Booking not found or reschedule endpoint not available", type: "error" });
      } else if (err.response?.status === 409) {
        setMessage({ text: "This slot is no longer available. Please select another.", type: "error" });
        const res = await api.get(`/api/bookings/available-slots/${selectedBunk}/${selectedDate}`);
        const slots = res.data.data?.availableSlots || [];
        setAvailableSlots(slots);
      } else {
        setMessage({
          text: err.response?.data?.message || "Failed to reschedule booking",
          type: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (hours, minutes = 0) => {
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  const displayMinute = minutes.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${ampm}`;
};

const formatTimeFromString = (timeString) => {
  if (!timeString) return "";

  if (timeString.includes('T')) {
    const date = new Date(timeString);
    return formatTime(date.getUTCHours(), date.getUTCMinutes());
  }

  const [hours, minutes] = timeString.split(':');
  return formatTime(parseInt(hours, 10), parseInt(minutes, 10));
};

const formatTimeSlot = (slotData) => {
  if (!slotData) return "";

  if (typeof slotData === 'string' && slotData.includes('T')) {
    const date = new Date(slotData);
    const startHour = date.getUTCHours();
    const startMinute = date.getUTCMinutes();
    const endHour = startHour + 1;
    return `${formatTime(startHour, startMinute)} - ${formatTime(endHour, startMinute)}`;
  }

  if (typeof slotData === 'object' && slotData.startTime && slotData.endTime) {
    return `${formatTimeFromString(slotData.startTime)} - ${formatTimeFromString(slotData.endTime)}`;
  }

  if (typeof slotData === 'string' && slotData.includes(':')) {
    const [hours, minutes] = slotData.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    return `${formatTime(h, m)} - ${formatTime(h + 1, m)}`;
  }

  if (typeof slotData === 'number') {
    return `${formatTime(slotData, 0)} - ${formatTime(slotData + 1, 0)}`;
  }

  return slotData.toString();
};

const getCurrentBookingTime = () => {
  if (!booking || !booking.startTime) return "";

  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);

  const formatTimeLocal = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour = hours % 12 || 12;

    return minutes === 0
      ? `${hour} ${ampm}`
      : `${hour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const startFormatted = formatTimeLocal(startTime);
  const endFormatted = formatTimeLocal(endTime);

  const startAMPM = startTime.getHours() >= 12 ? 'PM' : 'AM';
  const endAMPM = endTime.getHours() >= 12 ? 'PM' : 'AM';

  if (startAMPM === endAMPM) {
    const startWithoutAMPM = startFormatted.replace(` ${startAMPM}`, '');
    return `${startWithoutAMPM} - ${endFormatted}`;
  } else {
    return `${startFormatted} - ${endFormatted}`;
  }
};

  // Get today's date in YYYY-MM-DD format - SAME AS BookingForm
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get max date (30 days from now) - SAME AS BookingForm
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
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

        <form onSubmit={handleReschedule} className="space-y-8">
          {/* Bunk Selection */}
          <div className="space-y-3">
            <label htmlFor="bunk" className="block text-sm font-semibold text-gray-800 uppercase tracking-wide">
              Select EV Bunk
            </label>
            <select
              id="bunk"
              value={selectedBunk}
              onChange={(e) => setSelectedBunk(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              required
            >
              <option value="">Choose a bunk...</option>
              {bunks.map((bunk) => (
                <option key={bunk._id} value={bunk._id}>
                  {bunk.name} - {bunk.location}
                </option>
              ))}
            </select>
            
            {/* Bunk Details - SAME AS BookingForm */}
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
                min={getTodayDate()}
                max={getMaxDate()}
                required
              />
              <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Time Slot Selection - SAME STRUCTURE AS BookingForm */}
          {selectedBunk && selectedDate && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wide">
                Select New Time Slot
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
              type="submit"
              disabled={loading || !selectedSlot || !selectedDate || !selectedBunk}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                loading || !selectedSlot || !selectedDate || !selectedBunk
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Rescheduling...
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
                : message.type === 'info'
                ? 'bg-blue-50 border-blue-400 text-blue-800'
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
        </form>
      </div>
    </div>
  );
};

export default RescheduleBookingForm;