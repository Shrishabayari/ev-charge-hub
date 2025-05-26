import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Zap, Clock, Phone, Map, List } from 'lucide-react';

const EvBunkMapView = () => {
  const [bunkLocations, setBunkLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBunk, setSelectedBunk] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);

  const GOOGLE_MAPS_API_KEY = 'AIzaSyDozw7FDv161gMDT9lE-U0cSGZuWjYhyvw';

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    loadGoogleMaps().catch(error => {
      console.error('Failed to load Google Maps:', error);
      setError('Failed to load Google Maps');
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (window.google && window.google.maps && mapRef.current && viewMode === 'map') {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 12.9716, lng: 77.5946 }, // Bangalore center
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      const infoWindow = new window.google.maps.InfoWindow();
      infoWindowRef.current = infoWindow;
      setMap(mapInstance);
    }
  }, [viewMode]);

  // Update markers when bunk locations change
  useEffect(() => {
    if (map && bunkLocations.length > 0) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      const newMarkers = bunkLocations.map(bunk => {
        const marker = new window.google.maps.Marker({
          position: { lat: bunk.latitude, lng: bunk.longitude },
          map: map,
          title: bunk.name,
          icon: {
            url: bunk.slotsAvailable > 0 
              ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#10b981" stroke="white" stroke-width="2"/>
                  <path d="M12 16l4 4 8-8" stroke="white" stroke-width="2" fill="none"/>
                </svg>
              `)
              : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="white" stroke-width="2"/>
                  <path d="M20 12l-8 8M12 12l8 8" stroke="white" stroke-width="2"/>
                </svg>
              `),
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });

        marker.addListener('click', () => {
          setSelectedBunk(bunk);
          
          const infoContent = `
            <div style="max-width: 250px; font-family: Arial, sans-serif;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">${bunk.name}</h3>
              <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">${bunk.address}</p>
              <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">📞 ${bunk.phone}</p>
              <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">⏰ ${bunk.operatingHours}</p>
              <p style="margin: 5px 0; font-weight: bold; color: ${bunk.slotsAvailable > 0 ? '#10b981' : '#ef4444'};">
                ⚡ ${bunk.slotsAvailable} slots available
              </p>
              ${bunk.connectorTypes ? `
                <div style="margin-top: 8px;">
                  <small style="color: #6b7280;">Connectors: ${bunk.connectorTypes.join(', ')}</small>
                </div>
              ` : ''}
            </div>
          `;
          
          infoWindowRef.current.setContent(infoContent);
          infoWindowRef.current.open(map, marker);
        });

        return marker;
      });

      setMarkers(newMarkers);

      // Fit map to show all markers
      if (newMarkers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        newMarkers.forEach(marker => {
          bounds.extend(marker.getPosition());
        });
        map.fitBounds(bounds);
        
        // Ensure minimum zoom level
        const listener = window.google.maps.event.addListener(map, 'idle', () => {
          if (map.getZoom() > 15) map.setZoom(15);
          window.google.maps.event.removeListener(listener);
        });
      }
    }
  }, [map, bunkLocations]);

  // Fetch EV bunk locations
  const fetchBunkLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/bunks', {
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

  const fetchAvailableBunks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/bunks/available');
      
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

  const fetchNearbyBunks = async (lat = 12.9716, lng = 77.5946, radius = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/bunks/nearby?latitude=${lat}&longitude=${lng}&radius=${radius}`);
      
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
        
        {/* View Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <List className="h-4 w-4" />
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
              viewMode === 'map' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Map className="h-4 w-4" />
            Map View
          </button>
        </div>
        
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

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="mb-6">
          <div 
            ref={mapRef}
            className="w-full h-96 rounded-lg border border-gray-300"
            style={{ minHeight: '400px' }}
          >
            {!window.google && (
              <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                <p className="text-gray-600">Loading Google Maps...</p>
              </div>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-600 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Full</span>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
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

                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => setSelectedBunk(bunk)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => {
                      setViewMode('map');
                      // Center map on this bunk after a short delay to ensure map is loaded
                      setTimeout(() => {
                        if (map) {
                          map.setCenter({ lat: bunk.latitude, lng: bunk.longitude });
                          map.setZoom(16);
                        }
                      }, 100);
                    }}
                    className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
                  >
                    <Map className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

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

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedBunk.latitude},${selectedBunk.longitude}`;
                  window.open(url, '_blank');
                }}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                Get Directions
              </button>
              <button
                onClick={() => setSelectedBunk(null)}
                className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvBunkMapView;