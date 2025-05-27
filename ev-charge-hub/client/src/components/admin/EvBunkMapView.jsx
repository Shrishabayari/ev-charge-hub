import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, Clock, Phone, Map, List, Edit3, Navigation } from 'lucide-react';
import AdminNavbar from "../common/navbars/AdminNavbar";

const EvBunkMapView = () => {
  const [bunkLocations, setBunkLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBunk, setSelectedBunk] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('unknown'); // 'granted', 'denied', 'unknown'
  const [mapsLoaded, setMapsLoaded] = useState(false);
  
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef([]);
  const googleMapsScriptRef = useRef(null);
  const navigate = useNavigate();

  const GOOGLE_MAPS_API_KEY = 'AIzaSyDozw7FDv161gMDT9lE-U0cSGZuWjYhyvw';

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLocationPermission('granted');
          resolve(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationPermission('denied');
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }, []);

  // Load Google Maps script - Fixed to prevent multiple loading
  useEffect(() => {
    const loadGoogleMaps = () => {
      return new Promise((resolve, reject) => {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          setMapsLoaded(true);
          resolve();
          return;
        }

        // Check if script is already being loaded
        if (googleMapsScriptRef.current) {
          // Script is already loading, wait for it
          googleMapsScriptRef.current.addEventListener('load', () => {
            setMapsLoaded(true);
            resolve();
          });
          googleMapsScriptRef.current.addEventListener('error', reject);
          return;
        }

        // Check if script already exists in DOM
        const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
        if (existingScript) {
          if (window.google && window.google.maps) {
            setMapsLoaded(true);
            resolve();
          } else {
            existingScript.addEventListener('load', () => {
              setMapsLoaded(true);
              resolve();
            });
            existingScript.addEventListener('error', reject);
          }
          return;
        }

        // Create new script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setMapsLoaded(true);
          resolve();
        };
        script.onerror = reject;
        
        googleMapsScriptRef.current = script;
        document.head.appendChild(script);
      });
    };

    loadGoogleMaps().catch(error => {
      console.error('Failed to load Google Maps:', error);
      setError('Failed to load Google Maps');
    });

    // Cleanup function
    return () => {
      // Don't remove the script as it might be used by other components
      // Just clear the reference
      googleMapsScriptRef.current = null;
    };
  }, [GOOGLE_MAPS_API_KEY]);

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  // Initialize map
  useEffect(() => {
    if (mapsLoaded && mapRef.current && viewMode === 'map' && !map) {
      const center = userLocation || { lat: 12.9716, lng: 77.5946 }; // Default to Bangalore
      
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: center,
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

      // Add user location marker if available
      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: userLocation,
          map: mapInstance,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#2563eb" stroke="white" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24)
          }
        });
        
        // Don't add user marker to markersRef as it's not a bunk marker
      }
    }
  }, [mapsLoaded, viewMode, userLocation, map]);

  // Update markers when bunk locations change - Fixed dependency issue
  useEffect(() => {
    if (map && bunkLocations.length > 0) {
      // Clear existing markers
      clearMarkers();
      
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
              ${bunk.distance ? `
                <div style="margin-top: 8px;">
                  <small style="color: #6b7280;">Distance: ${bunk.distance.toFixed(1)} km away</small>
                </div>
              ` : ''}
            </div>
          `;
          
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(infoContent);
            infoWindowRef.current.open(map, marker);
          }
        });

        return marker;
      });

      markersRef.current = newMarkers;

      // Fit map to show all markers
      if (newMarkers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        
        // Include user location in bounds if available
        if (userLocation) {
          bounds.extend(userLocation);
        }
        
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
  }, [map, bunkLocations, userLocation, clearMarkers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearMarkers();
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [clearMarkers]);

  // Fetch EV bunk locations - FIXED API ENDPOINT
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

  const fetchNearbyBunks = async (lat, lng, radius = 10) => {
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

  // Handle nearby button click with geolocation
  const handleNearbyClick = async () => {
    try {
      setLoading(true);
      const location = await getCurrentLocation();
      await fetchNearbyBunks(location.lat, location.lng);
      
      // Switch to map view and center on user location
      setViewMode('map');
    } catch (error) {
      console.error('Error getting location:', error);
      // Fallback to Bangalore coordinates
      await fetchNearbyBunks(12.9716, 77.5946);
      alert('Could not get your location. Showing nearby stations from Bangalore center.');
    }
  };

  // Handle edit button click
  const handleEditBunk = (bunkId) => {
    navigate(`/admin/edit-bunk/${bunkId}`);
  };

  // Handle view mode change - clear map when switching to list
  const handleViewModeChange = (mode) => {
    if (mode === 'list' && map) {
      // Clear map reference when switching to list view
      setMap(null);
      clearMarkers();
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    }
    setViewMode(mode);
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
    <div>
      <AdminNavbar/>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">EV Charging Stations</h1>
          
          {/* Location Permission Status */}
          {locationPermission !== 'unknown' && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              locationPermission === 'granted' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
            }`}>
              {locationPermission === 'granted' ? (
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  Location access granted - showing personalized results
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location access denied - using default location (Bangalore)
                </div>
              )}
            </div>
          )}
          
          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleViewModeChange('list')}
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
              onClick={() => handleViewModeChange('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                viewMode === 'map' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              disabled={!mapsLoaded}
            >
              <Map className="h-4 w-4" />
              {mapsLoaded ? 'Map View' : 'Loading Maps...'}
            </button>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={fetchBunkLocations}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <Zap className="h-4 w-4" />
              All Stations
            </button>
            <button 
              onClick={fetchAvailableBunks}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <Zap className="h-4 w-4" />
              Available Only
            </button>
            <button 
              onClick={handleNearbyClick}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <Navigation className="h-4 w-4" />
              {loading ? 'Finding...' : 'Nearby Stations'}
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
              {!mapsLoaded && (
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
              {userLocation && (
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Your Location</span>
                </div>
              )}
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditBunk(bunk._id)}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Station"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bunk.slotsAvailable > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {bunk.slotsAvailable > 0 ? 'Available' : 'Full'}
                      </span>
                    </div>
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
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {bunk.distance.toFixed(1)} km away
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
                      onClick={() => handleEditBunk(bunk._id)}
                      className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors flex items-center gap-1"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        handleViewModeChange('map');
                        // Center map on this bunk after a short delay to ensure map is loaded
                        setTimeout(() => {
                          if (map) {
                            map.setCenter({ lat: bunk.latitude, lng: bunk.longitude });
                            map.setZoom(16);
                          }
                        }, 100);
                      }}
                      className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
                      disabled={!mapsLoaded}
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditBunk(selectedBunk._id)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit Station"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setSelectedBunk(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
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

                {selectedBunk.distance && (
                  <p className="flex items-center gap-1">
                    <Navigation className="h-4 w-4" />
                    <strong>Distance:</strong> {selectedBunk.distance.toFixed(1)} km away
                  </p>
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
                  onClick={() => handleEditBunk(selectedBunk._id)}
                  className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors flex items-center gap-1"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
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
    </div>
  );
};

export default EvBunkMapView;