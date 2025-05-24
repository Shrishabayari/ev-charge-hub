import React, { useState, useEffect } from 'react';
import { MapPin, Zap, Star, Clock, DollarSign, Wifi, Car, Coffee, Loader } from 'lucide-react';

const EVBunkLocationsMap = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBunk, setSelectedBunk] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch bunk locations from your API
  const fetchBunkLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bunks/locations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setLocations(result.data);
        setError(null);
      } else {
        throw new Error(result.message || 'Failed to fetch locations');
      }
    } catch (err) {
      console.error('Error fetching bunk locations:', err);
      setError(err.message);
      // Fallback to sample data for demonstration
      setLocations([
        {
          id: '1',
          name: 'Downtown EV Hub',
          address: '123 Main St, Downtown',
          latitude: 40.7128,
          longitude: -74.0060,
          totalSlots: 20,
          availableSlots: 12,
          pricePerHour: 15,
          amenities: ['wifi', 'cafe', 'restroom'],
          rating: 4.5
        },
        {
          id: '2',
          name: 'Mall Charging Station',
          address: '456 Shopping Blvd, Mall Area',
          latitude: 40.7589,
          longitude: -73.9851,
          totalSlots: 15,
          availableSlots: 8,
          pricePerHour: 12,
          amenities: ['wifi', 'shopping'],
          rating: 4.2
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  };

  useEffect(() => {
    fetchBunkLocations();
    getUserLocation();
  }, []);

  // Calculate distance between two points (rough approximation)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get amenity icon
  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'cafe': case 'coffee': return <Coffee className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  // Book a charging slot
  const handleBooking = async (bunkId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book a charging slot');
        return;
      }

      // Redirect to booking page or show booking modal
      window.location.href = `/book/${bunkId}`;
    } catch (error) {
      console.error('Booking error:', error);
      alert('Error initiating booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading charging stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">EV Charging Stations</h1>
              <p className="text-gray-600 mt-1">Find and book charging slots near you</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{locations.length} stations available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  Warning: Using sample data. API Error: {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map</h3>
                  <p className="text-gray-600">Integrate with Google Maps or Mapbox to show actual locations</p>
                </div>
                
                {/* Sample location markers */}
                {locations.map((location, index) => (
                  <div
                    key={location.id}
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                      index === 0 ? 'top-1/3 left-1/4' : 
                      index === 1 ? 'top-1/2 left-3/4' : 
                      'top-2/3 left-1/2'
                    }`}
                    onClick={() => setSelectedBunk(location)}
                  >
                    <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                      <Zap className="w-4 h-4" />
                    </div>
                    {selectedBunk?.id === location.id && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white p-2 rounded shadow-lg min-w-48 z-10">
                        <p className="font-semibold text-sm">{location.name}</p>
                        <p className="text-xs text-gray-600">{location.availableSlots}/{location.totalSlots} available</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Station List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Stations</h2>
            
            {locations.map((location) => (
              <div key={location.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {location.address}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{location.rating}</span>
                  </div>
                </div>

                {/* Availability Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        location.availableSlots > 0 ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <span className="text-sm font-medium">
                        {location.availableSlots}/{location.totalSlots} Available
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ${location.pricePerHour}/hr
                  </div>
                </div>

                {/* Amenities */}
                {location.amenities && location.amenities.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {location.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs">
                          {getAmenityIcon(amenity)}
                          <span className="ml-1 capitalize">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Distance (if user location available) */}
                {userLocation && (
                  <div className="mb-4 text-sm text-gray-600">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {calculateDistance(
                      userLocation.lat, 
                      userLocation.lng, 
                      location.latitude, 
                      location.longitude
                    ).toFixed(1)} km away
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={() => handleBooking(location.id)}
                  disabled={location.availableSlots === 0}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    location.availableSlots > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {location.availableSlots > 0 ? 'Book Now' : 'Fully Booked'}
                </button>
              </div>
            ))}

            {locations.length === 0 && !loading && (
              <div className="text-center py-8">
                <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No charging stations found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => {
            setLoading(true);
            fetchBunkLocations();
          }}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Refresh locations"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EVBunkLocationsMap;