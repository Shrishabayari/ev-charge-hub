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
  const [locationPermission, setLocationPermission] = useState('unknown');
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const googleMapsScriptRef = useRef(null);
  const navigate = useNavigate();

  const GOOGLE_MAPS_API_KEY = 'AIzaSyDozw7FDv161gMDT9lE-U0cSGZuWjYhyvw';

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Add distance calculation to bunks
  const addDistanceToBunks = (bunks, userLat, userLng) => {
    return bunks.map(bunk => ({
      ...bunk,
      distance: calculateDistance(userLat, userLng, bunk.latitude, bunk.longitude)
    })).sort((a, b) => a.distance - b.distance);
  };

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
          maximumAge: 300000
        }
      );
    });
  }, []);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          setMapsLoaded(true);
          resolve();
          return;
        }

        if (googleMapsScriptRef.current) {
          googleMapsScriptRef.current.addEventListener('load', () => {
            setMapsLoaded(true);
            resolve();
          });
          googleMapsScriptRef.current.addEventListener('error', reject);
          return;
        }

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

    return () => {
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

  // Clear directions
  const clearDirections = useCallback(() => {
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
  }, []);

  // Show directions between user and selected bunk
  const showDirections = useCallback((destinationBunk) => {
    if (!map || !userLocation || !window.google) return;

    clearDirections();

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#4285f4',
        strokeWeight: 4,
        strokeOpacity: 0.8
      }
    });

    directionsRenderer.setMap(map);
    directionsRendererRef.current = directionsRenderer;

    const request = {
      origin: userLocation,
      destination: { lat: destinationBunk.latitude, lng: destinationBunk.longitude },
      travelMode: window.google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
        
        // Update the distance with actual driving distance
        const route = result.routes[0];
        const leg = route.legs[0];
        const drivingDistance = leg.distance.value / 1000; // Convert to km
        
        // Update the bunk with driving distance
        setBunkLocations(prevBunks => 
          prevBunks.map(bunk => 
            bunk._id === destinationBunk._id 
              ? { ...bunk, drivingDistance: drivingDistance }
              : bunk
          )
        );
      } else {
        console.error('Directions request failed:', status);
      }
    });
  }, [map, userLocation, clearDirections]);

  // Add or update user location marker
  const updateUserLocationMarker = useCallback((mapInstance) => {
    if (userLocation && mapInstance && window.google) {
      // Remove existing user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }

      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: mapInstance,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#2563eb" stroke="white" stroke-width="3"/>
              <circle cx="16" cy="16" r="4" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32)
        },
        zIndex: 1000
      });
      
      userMarkerRef.current = userMarker;

      // Add click listener to user marker
      userMarker.addListener('click', () => {
        if (infoWindowRef.current) {
          const infoContent = `
            <div style="max-width: 200px; font-family: Arial, sans-serif;">
              <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">📍 Your Location</h3>
              <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">
                Lat: ${userLocation.lat.toFixed(6)}<br>
                Lng: ${userLocation.lng.toFixed(6)}
              </p>
            </div>
          `;
          infoWindowRef.current.setContent(infoContent);
          infoWindowRef.current.open(mapInstance, userMarker);
        }
      });
    }
  }, [userLocation]);

  // Initialize or reinitialize map
  const initializeMap = useCallback((forceReinit = false) => {
    if (mapsLoaded && mapRef.current && viewMode === 'map' && window.google && (!map || forceReinit)) {
      // Clear existing map if reinitializing
      if (map && forceReinit) {
        clearMarkers();
        clearDirections();
        if (userMarkerRef.current) {
          userMarkerRef.current.setMap(null);
          userMarkerRef.current = null;
        }
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
      }

      const center = userLocation || { lat: 12.9716, lng: 77.5946 };
      
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: userLocation ? 13 : 11,
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

      // Add user location marker
      updateUserLocationMarker(mapInstance);

      return mapInstance;
    }
    return map;
  }, [mapsLoaded, viewMode, userLocation, map, updateUserLocationMarker, clearMarkers, clearDirections]);

  // Initialize map
  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  // Update user marker when location changes
  useEffect(() => {
    if (map && userLocation) {
      updateUserLocationMarker(map);
    }
  }, [map, userLocation, updateUserLocationMarker]);

  // Update markers when bunk locations change
  useEffect(() => {
    if (map && bunkLocations.length > 0 && window.google) {
      clearMarkers();
      clearDirections();
      
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
            <div style="max-width: 300px; font-family: Arial, sans-serif;">
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
                  <small style="color: #6b7280;">📍 Distance: ${bunk.distance.toFixed(1)} km away</small>
                </div>
              ` : ''}
              ${userLocation ? `
                <div style="margin-top: 10px;">
                  <button onclick="window.showDirectionsToStation('${bunk._id}')" 
                          style="background: #3b82f6; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    🧭 Show Route
                  </button>
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

      // Fit map to show all markers including user location
      if (newMarkers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        
        // Add user location to bounds if available
        if (userLocation) {
          bounds.extend(userLocation);
        }
        
        // Add all bunk locations to bounds
        newMarkers.forEach(marker => {
          bounds.extend(marker.getPosition());
        });
        
        // Fit the map to show all markers
        map.fitBounds(bounds);
        
        // Set a maximum zoom level
        const listener = window.google.maps.event.addListener(map, 'idle', () => {
          if (map.getZoom() > 15) map.setZoom(15);
          window.google.maps.event.removeListener(listener);
        });
      }
    }
  }, [map, bunkLocations, userLocation, clearMarkers, clearDirections]);

  // Add global function for showing directions (called from info window)
  useEffect(() => {
    window.showDirectionsToStation = (bunkId) => {
      const bunk = bunkLocations.find(b => b._id === bunkId);
      if (bunk) {
        showDirections(bunk);
      }
    };

    return () => {
      delete window.showDirectionsToStation;
    };
  }, [bunkLocations, showDirections]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearMarkers();
      clearDirections();
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [clearMarkers, clearDirections]);

  // Fetch EV bunk locations
  const fetchBunkLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowNearbyOnly(false);
      
      console.log('🔍 Fetching bunk locations...');
      
      const response = await fetch('/api/bunks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Raw API response:', data);
      
      let bunks = [];
      if (data.success) {
        bunks = data.data || [];
        console.log('✅ Using data.data:', bunks.length, 'items');
      } else if (Array.isArray(data)) {
        bunks = data;
        console.log('✅ Using array data:', bunks.length, 'items');
      } else {
        console.log('❌ Unexpected data format:', typeof data);
      }

      console.log('🏪 Final bunks array:', bunks);
      console.log('🏪 Bunks count:', bunks.length);

      if (userLocation && bunks.length > 0) {
        bunks = addDistanceToBunks(bunks, userLocation.lat, userLocation.lng);
        console.log('📍 Added distances to bunks');
      }

      setBunkLocations(bunks);
      console.log('✅ Set bunk locations in state');
      
    } catch (error) {
      console.error('❌ Error fetching bunk locations:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack
      });
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
      setShowNearbyOnly(false);
      
      const response = await fetch('/api/bunks/available');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let bunks = data.data || [];

      if (userLocation && bunks.length > 0) {
        bunks = addDistanceToBunks(bunks, userLocation.lat, userLocation.lng);
      }

      setBunkLocations(bunks);
    } catch (error) {
      console.error('Error fetching available bunks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced nearby bunks function with improved map handling
  const fetchNearbyBunks = async (lat, lng, radius = 15) => {
    try {
      setLoading(true);
      setError(null);
      setShowNearbyOnly(true);
      
      console.log('🔍 Fetching nearby bunks...', { lat, lng, radius });
      
      // First try to get user location if not provided
      let userLat = lat;
      let userLng = lng;
      
      if (!userLat || !userLng) {
        try {
          const location = await getCurrentLocation();
          userLat = location.lat;
          userLng = location.lng;
          console.log('📍 Got user location:', { userLat, userLng });
        } catch (locationError) {
          console.warn('Could not get user location:', locationError);
          // Use default location (Bangalore)
          userLat = 12.9716;
          userLng = 77.5946;
        }
      }

      // Try the nearby API endpoint first
      let bunks = [];
      try {
        const response = await fetch(`/api/bunks/nearby?latitude=${userLat}&longitude=${userLng}&radius=${radius}`);
        
        if (response.ok) {
          const data = await response.json();
          bunks = data.data || [];
          console.log('✅ Got bunks from nearby API:', bunks.length);
        } else {
          throw new Error('Nearby API not available');
        }
      } catch (apiError) {
        console.log('Nearby API not available, falling back to local calculation');
        
        // Fallback: fetch all bunks and filter/calculate distance locally
        const allBunksResponse = await fetch('/api/bunks');
        if (allBunksResponse.ok) {
          const allData = await allBunksResponse.json();
          const allBunks = allData.success ? allData.data || [] : (Array.isArray(allData) ? allData : []);
          
          console.log('📦 Got all bunks for filtering:', allBunks.length);
          
          // Calculate distances and filter by radius
          bunks = allBunks
            .map(bunk => ({
              ...bunk,
              distance: calculateDistance(userLat, userLng, bunk.latitude, bunk.longitude)
            }))
            .filter(bunk => bunk.distance <= radius)
            .sort((a, b) => a.distance - b.distance);
            
          console.log('📍 Filtered bunks within radius:', bunks.length);
        } else {
          throw new Error('Failed to fetch bunks');
        }
      }

      // Ensure distance is calculated for all bunks
      if (bunks.length > 0) {
        bunks = bunks.map(bunk => ({
          ...bunk,
          distance: bunk.distance || calculateDistance(userLat, userLng, bunk.latitude, bunk.longitude)
        })).sort((a, b) => a.distance - b.distance);
      }

      console.log('🏪 Final nearby bunks:', bunks.length);
      setBunkLocations(bunks);
      
      // Switch to map view automatically to show the nearby stations
      setViewMode('map');
      
      // Force reinitialize map if needed to ensure proper display
      setTimeout(() => {
        if (viewMode === 'map' || true) { // Force map initialization
          const mapInstance = initializeMap(true);
          if (mapInstance && bunks.length > 0) {
            console.log('🗺️ Map reinitialized for nearby view');
          }
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ Error fetching nearby bunks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle nearby button click with improved geolocation
  const handleNearbyClick = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🎯 Nearby button clicked');
      
      // Get user location
      const location = await getCurrentLocation();
      console.log('📍 User location obtained:', location);
      
      await fetchNearbyBunks(location.lat, location.lng, 15); // 15km radius
      
    } catch (error) {
      console.error('❌ Error getting location:', error);
      
      // Show more user-friendly error and fallback
      const fallbackLocation = { lat: 12.9716, lng: 77.5946 };
      setUserLocation(fallbackLocation);
      
      try {
        await fetchNearbyBunks(fallbackLocation.lat, fallbackLocation.lng, 15);
        setError('Could not get your exact location. Showing nearby stations from Bangalore center.');
      } catch (fallbackError) {
        setError('Failed to fetch nearby stations. Please try again.');
      }
    }
  };

  const handleEditBunk = (bunkId) => {
    navigate(`/admin/edit-bunk/${bunkId}`);
  };

  const handleViewModeChange = (mode) => {
    if (mode === 'list' && map) {
      setMap(null);
      clearMarkers();
      clearDirections();
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    }
    setViewMode(mode);
  };

  useEffect(() => {
    fetchBunkLocations();
  }, []);

  // Recalculate distances when user location changes
  useEffect(() => {
    if (userLocation && bunkLocations.length > 0 && !showNearbyOnly) {
      const bunksWithDistance = addDistanceToBunks(bunkLocations, userLocation.lat, userLocation.lng);
      setBunkLocations(bunksWithDistance);
    }
  }, [userLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {showNearbyOnly ? 'Finding nearby charging stations...' : 'Loading EV charging locations...'}
          </p>
        </div>
      </div>
    );
  }

  if (error && bunkLocations.length === 0) {
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
                  Location access granted - showing personalized results with distances
                  {userLocation && (
                    <span className="text-xs bg-green-100 px-2 py-1 rounded">
                      📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location access denied - using default location (Bangalore)
                </div>
              )}
            </div>
          )}

          {/* Error message for non-fatal errors */}
          {error && bunkLocations.length > 0 && (
            <div className="mb-4 p-3 rounded-lg text-sm bg-yellow-50 text-yellow-700 border border-yellow-200">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {error}
              </div>
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
            >
              <Map className="h-4 w-4" />
              Map View
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={fetchBunkLocations}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Zap className="h-4 w-4" />
              All Stations
            </button>
            <button
              onClick={fetchAvailableBunks}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Available Only
            </button>
            <button
              onClick={handleNearbyClick}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              <Navigation className="h-4 w-4" />
              {loading && showNearbyOnly ? 'Finding Nearby...' : 'Nearby Stations'}
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600">Total Stations</p>
                  <p className="text-2xl font-bold text-blue-800">{bunkLocations.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-green-600">Available Now</p>
                  <p className="text-2xl font-bold text-green-800">
                    {bunkLocations.filter(bunk => bunk.slotsAvailable > 0).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-yellow-600">Total Slots</p>
                  <p className="text-2xl font-bold text-yellow-800">
                    {bunkLocations.reduce((sum, bunk) => sum + (bunk.slotsAvailable || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {bunkLocations.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No charging stations found</h3>
                <p className="text-gray-400">Try refreshing or check your connection</p>
              </div>
            ) : (
              bunkLocations.map((bunk) => (
                <div
                  key={bunk._id}
                  className={`bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                    selectedBunk?._id === bunk._id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedBunk(bunk)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{bunk.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{bunk.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{bunk.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{bunk.operatingHours}</span>
                      </div>
                      {bunk.distance && (
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Navigation className="h-4 w-4" />
                          <span className="text-sm">{bunk.distance.toFixed(1)} km away</span>
                          {bunk.drivingDistance && (
                            <span className="text-xs text-blue-600">
                              ({bunk.drivingDistance.toFixed(1)} km by road)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        bunk.slotsAvailable > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <Zap className="h-4 w-4 inline mr-1" />
                        {bunk.slotsAvailable} slots
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBunk(bunk._id);
                        }}
                        className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                    </div>
                  </div>
                  
                  {/* Connector Types */}
                  {bunk.connectorTypes && bunk.connectorTypes.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">Available Connectors:</p>
                      <div className="flex flex-wrap gap-1">
                        {bunk.connectorTypes.map((connector, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {connector}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  {userLocation && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewMode('map');
                          setTimeout(() => showDirections(bunk), 500);
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        <Navigation className="h-4 w-4" />
                        Show Route
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewMode('map');
                          setSelectedBunk(bunk);
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        <Map className="h-4 w-4" />
                        View on Map
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Map View */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {!mapsLoaded ? (
              <div className="h-96 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            ) : (
              <div ref={mapRef} className="w-full h-96"></div>
            )}
            
            {/* Map Legend */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Your Location</span>
                </div>
                {userLocation && (
                  <div className="text-xs text-gray-600">
                    💡 Click on markers for details and directions
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Selected Bunk Details (Modal/Sidebar) */}
        {selectedBunk && viewMode === 'list' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{selectedBunk.name}</h3>
                  <button
                    onClick={() => setSelectedBunk(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{selectedBunk.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{selectedBunk.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{selectedBunk.operatingHours}</span>
                  </div>
                  <div className={`flex items-center gap-2 font-medium ${
                    selectedBunk.slotsAvailable > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <Zap className="h-4 w-4" />
                    <span>{selectedBunk.slotsAvailable} slots available</span>
                  </div>
                  
                  {selectedBunk.distance && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Navigation className="h-4 w-4" />
                      <span className="text-sm">{selectedBunk.distance.toFixed(1)} km away</span>
                    </div>
                  )}
                  
                  {selectedBunk.connectorTypes && selectedBunk.connectorTypes.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Available Connectors:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedBunk.connectorTypes.map((connector, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
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
                    onClick={() => handleEditBunk(selectedBunk._id)}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Station
                  </button>
                  {userLocation && (
                    <button
                      onClick={() => {
                        setViewMode('map');
                        setTimeout(() => showDirections(selectedBunk), 500);
                        setSelectedBunk(null);
                      }}
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      <Navigation className="h-4 w-4" />
                      Get Directions
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvBunkMapView;