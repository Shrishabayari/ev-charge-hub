import React, { useState, useEffect } from 'react';
import { MapPin, Zap, Clock, Phone } from 'lucide-react';

const EvBunkMapView = () => {
  const [bunkLocations, setBunkLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBunk, setSelectedBunk] = useState(null);

  // Fetch EV bunk locations
  const fetchBunkLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Updated API endpoint - make sure this matches your backend
      const response = await fetch('/api/ev-bunks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Handle both old and new response formats
      if (data.success) {
        setBunkLocations(data.data || []);
      } else if (Array.isArray(data)) {
        setBunkLocations(data);
      } else {
        setBunkLocations([]);
      }
    } catch (error) {
      console.error('Error fetching bunk locations:', error);
      setError(error.message);
      setBunkLocations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available bunks only
  const fetchAvailableBunks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/ev-bunks/available');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBunkLocations(data.data || []);
    } catch (error) {
      console.error('Error fetching available bunks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch nearby bunks (example with hardcoded location)
  const fetchNearbyBunks = async (lat = 12.9716, lng = 77.5946, radius = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/ev-bunks/nearby?latitude=${lat}&longitude=${lng}&radius=${radius}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBunkLocations(data.data || []);
    } catch (error) {
      console.error('Error fetching nearby bunks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBunkLocations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EV charging locations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
          <div className="text-red-600 mb-4">
            <Zap className="h-12 w-12 mx-auto mb-2" />
            <h3 className="font-semibold text-lg">Connection Error</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button 
            onClick={fetchBunkLocations}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">EV Charging Stations</h1>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={fetchBunkLocations}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            All Stations
          </button>
          <button 
            onClick={fetchAvailableBunks}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Available Only
          </button>
          <button 
            onClick={() => fetchNearbyBunks()}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            Nearby (Bangalore)
          </button>
        </div>

        <p className="text-gray-600">
          Found {bunkLocations.length} charging station{bunkLocations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bunkLocations.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Charging Stations Found</h3>
            <p className="text-gray-500">Try adding some EV charging stations to get started.</p>
          </div>
        ) : (
          bunkLocations.map((bunk) => (
            <div 
              key={bunk._id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                  <h3 className="font-semibold text-lg text-gray-800">{bunk.name}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  bunk.slotsAvailable > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {bunk.slotsAvailable > 0 ? 'Available' : 'Full'}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-gray-600 text-sm">{bunk.address}</p>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {bunk.phone}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {bunk.operatingHours}
                </div>

                <div className="flex items-center text-sm">
                  <Zap className="h-4 w-4 mr-2 text-yellow-600" />
                  <span className="font-medium">{bunk.slotsAvailable} slots available</span>
                </div>

                {bunk.connectorTypes && bunk.connectorTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {bunk.connectorTypes.map((connector, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {connector}
                      </span>
                    ))}
                  </div>
                )}

                {bunk.distance && (
                  <p className="text-sm text-gray-500">
                    Distance: {bunk.distance} km away
                  </p>
                )}
              </div>

              <button 
                onClick={() => setSelectedBunk(bunk)}
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal for selected bunk details */}
      {selectedBunk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedBunk.name}</h2>
              <button 
                onClick={() => setSelectedBunk(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <p><strong>Address:</strong> {selectedBunk.address}</p>
              <p><strong>Phone:</strong> {selectedBunk.phone}</p>
              <p><strong>Operating Hours:</strong> {selectedBunk.operatingHours}</p>
              <p><strong>Available Slots:</strong> {selectedBunk.slotsAvailable}</p>
              <p><strong>Coordinates:</strong> {selectedBunk.latitude}, {selectedBunk.longitude}</p>
              
              {selectedBunk.connectorTypes && (
                <div>
                  <strong>Connector Types:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedBunk.connectorTypes.map((connector, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {connector}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvBunkMapView;