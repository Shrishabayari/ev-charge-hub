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
  
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const directionsRendererRef = useRef(null);
  const directionsServiceRef = useRef(null);
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

  // Open Google Maps with directions
  const openInGoogleMaps = (bunk) => {
    let url;
    
    if (userLocation) {
      // If user location is available, show directions from current location
      url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${bunk.latitude},${bunk.longitude}/@${bunk.latitude},${bunk.longitude},15z/data=!4m2!4m1!3e0`;
    } else {
      // If no user location, just open the destination
      url = `https://www.google.com/maps/search/?api=1&query=${bunk.latitude},${bunk.longitude}&query_place_id=${encodeURIComponent(bunk.name)}`;
    }
    
    // Open in new tab
    window.open(url, '_blank');
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
          timeout: 15000,
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
      setError('Failed to load Google Maps. Please check your API key and internet connection.');
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
    if (!map || !userLocation || !window.google) {
      console.log('Cannot show directions: missing requirements', { 
        map: !!map, 
        userLocation: !!userLocation, 
        google: !!window.google 
      });
      return;
    }

    try {
      // Clear existing directions
      clearDirections();

      // Initialize directions service if not already done
      if (!directionsServiceRef.current) {
        directionsServiceRef.current = new window.google.maps.DirectionsService();
      }

      // Create new directions renderer
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: '#4285f4',
          strokeWeight: 4,
          strokeOpacity: 0.8
        },
        markerOptions: {
          origin: {
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#2563eb" stroke="white" stroke-width="3"/>
                  <circle cx="16" cy="16" r="4" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32)
            }
          },
          destination: {
            icon: {
              url: destinationBunk.slotsAvailable > 0 
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
          }
        }
      });

      directionsRenderer.setMap(map);
      directionsRendererRef.current = directionsRenderer;

      const request = {
        origin: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
        destination: new window.google.maps.LatLng(destinationBunk.latitude, destinationBunk.longitude),
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      };

      console.log('Requesting directions with:', request);

      directionsServiceRef.current.route(request, (result, status) => {
        console.log('Directions response:', status, result);
        
        if (status === 'OK' || status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          
          // Update the distance with actual driving distance
          const route = result.routes[0];
          const leg = route.legs[0];
          const drivingDistance = leg.distance.value / 1000; // Convert to km
          const drivingTime = leg.duration.text;
          
          console.log('Route calculated:', {
            distance: leg.distance.text,
            duration: leg.duration.text,
            summary: route.summary
          });
          
          // Update the bunk with driving distance
          setBunkLocations(prevBunks => 
            prevBunks.map(bunk => 
              bunk._id === destinationBunk._id 
                ? { ...bunk, drivingDistance: drivingDistance, drivingTime: drivingTime }
                : bunk
            )
          );

          // Show info about the route
          if (infoWindowRef.current) {
            const infoContent = `
              <div style="max-width: 300px; font-family: Arial, sans-serif; padding: 10px;">
                <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 16px;">🗺️ Route to ${destinationBunk.name}</h3>
                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">📍 Distance: ${leg.distance.text}</p>
                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">⏱️ Duration: ${leg.duration.text}</p>
                <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">🚗 Via: ${route.summary}</p>
                <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
                  <button onclick="window.clearDirectionsFromRoute()" 
                          style="background: #ef4444; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;">
                    ❌ Clear Route
                  </button>
                  <button onclick="window.openInGoogleMaps('${destinationBunk.latitude}', '${destinationBunk.longitude}', '${encodeURIComponent(destinationBunk.name)}')" 
                          style="background: #10b981; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;">
                    🗺️ Open in Google Maps
                  </button>
                </div>
              </div>
            `;
            
            // Position info window at destination
            const destinationPosition = new window.google.maps.LatLng(
              destinationBunk.latitude, 
              destinationBunk.longitude
            );
            
            infoWindowRef.current.setContent(infoContent);
            infoWindowRef.current.setPosition(destinationPosition);
            infoWindowRef.current.open(map);
          }

          console.log('✅ Directions loaded successfully');
          
        } else {
          console.error('❌ Directions request failed:', status);
          let errorMessage = 'Failed to calculate route.';
          
          switch (status) {
            case 'ZERO_RESULTS':
              errorMessage = 'No route could be found between the origin and destination.';
              break;
            case 'OVER_QUERY_LIMIT':
              errorMessage = 'Too many requests. Please try again later.';
              break;
            case 'REQUEST_DENIED':
              errorMessage = 'Directions request was denied. Please check API key permissions.';
              break;
            case 'INVALID_REQUEST':
              errorMessage = 'Invalid directions request.';
              break;
            case 'UNKNOWN_ERROR':
              errorMessage = 'Unknown error occurred. Please try again.';
              break;
          }
          
          alert(errorMessage);
        }
      });
      
    } catch (error) {
      console.error('Error showing directions:', error);
      alert('Error showing directions: ' + error.message);
    }
  }, [map, userLocation, clearDirections]);

  // Handle show directions from list view
  const handleShowDirections = useCallback((bunk) => {
    if (!userLocation) {
      alert('Location access is required to show directions. Please enable location access and refresh the page.');
      return;
    }

    if (!mapsLoaded) {
      alert('Google Maps is still loading. Please wait a moment and try again.');
      return;
    }

    console.log('Showing directions for bunk:', bunk.name);
    
    // Switch to map view
    setViewMode('map');
    setSelectedBunk(bunk);
    
    // Wait for map to initialize, then show directions
    setTimeout(() => {
      if (map) {
        showDirections(bunk);
      } else {
        console.log('Map not ready, waiting longer...');
        // If map isn't ready, wait a bit more
        setTimeout(() => {
          if (map) {
            showDirections(bunk);
          } else {
            console.error('Map failed to initialize');
          }
        }, 2000);
      }
    }, 1000);
  }, [userLocation, mapsLoaded, map, showDirections]);

  // Add or update user location marker
  const updateUserLocationMarker = useCallback((mapInstance) => {
    if (userLocation && mapInstance && window.google) {
      // Remove existing user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }

      const userMarker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
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
            <div style="max-width: 200px; font-family: Arial, sans-serif; padding: 8px;">
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
      console.log('Initializing map...');
      
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
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      });

      const infoWindow = new window.google.maps.InfoWindow();
      infoWindowRef.current = infoWindow;
      
      // Initialize directions service
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      
      setMap(mapInstance);

      // Add user location marker
      updateUserLocationMarker(mapInstance);

      console.log('✅ Map initialized successfully');
      return mapInstance;
    }
    return map;
  }, [mapsLoaded, viewMode, userLocation, map, updateUserLocationMarker, clearMarkers, clearDirections]);

  // Initialize map when switching to map view
  useEffect(() => {
    if (viewMode === 'map') {
      const mapInstance = initializeMap();
      // If we have a selected bunk and directions should be shown
      if (selectedBunk && mapInstance && userLocation) {
        setTimeout(() => {
          showDirections(selectedBunk);
        }, 1500);
      }
    }
  }, [initializeMap, viewMode, selectedBunk, userLocation, showDirections]);

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
      
      const newMarkers = bunkLocations.map(bunk => {
        const marker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(bunk.latitude, bunk.longitude),
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
            <div style="max-width: 300px; font-family: Arial, sans-serif; padding: 10px;">
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
              <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
                <button onclick="window.openInGoogleMapsFromMarker('${bunk.latitude}', '${bunk.longitude}', '${encodeURIComponent(bunk.name)}')" 
                        style="background: #10b981; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;">
                  🗺️ Open in Google Maps
                </button>
                ${userLocation ? `
                  <button onclick="window.showDirectionsToStation('${bunk._id}')" 
                          style="background: #3b82f6; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500;">
                    🧭 Show Route
                  </button>
                ` : ''}
              </div>
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
          bounds.extend(new window.google.maps.LatLng(userLocation.lat, userLocation.lng));
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
  }, [map, bunkLocations, userLocation, clearMarkers]);

  // Add global functions for info window interactions
  useEffect(() => {
    window.showDirectionsToStation = (bunkId) => {
      console.log('Global function called for bunk:', bunkId);
      const bunk = bunkLocations.find(b => b._id === bunkId);
      if (bunk) {
        showDirections(bunk);
      } else {
        console.error('Bunk not found:', bunkId);
      }
    };

    window.clearDirectionsFromRoute = () => {
      console.log('Clearing directions from global function');
      clearDirections();
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };

    window.openInGoogleMaps = (lat, lng, name) => {
      let url;
      if (userLocation) {
        url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${lat},${lng}/@${lat},${lng},15z/data=!4m2!4m1!3e0`;
      } else {
        url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${name}`;
      }
      window.open(url, '_blank');
    };

    window.openInGoogleMapsFromMarker = (lat, lng, name) => {
      let url;
      if (userLocation) {
        url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${lat},${lng}/@${lat},${lng},15z/data=!4m2!4m1!3e0`;
      } else {
        url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${name}`;
      }
      window.open(url, '_blank');
    };

    return () => {
      delete window.showDirectionsToStation;
      delete window.clearDirectionsFromRoute;
      delete window.openInGoogleMaps;
      delete window.openInGoogleMapsFromMarker;
    };
  }, [bunkLocations, showDirections, clearDirections, userLocation]);

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
      setError(`Failed to fetch charging stations: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch and location setup
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing app...');
      
      // Try to get user location first
      try {
        await getCurrentLocation();
        console.log('📍 Got user location');
      } catch (error) {
        console.log('📍 Could not get location:', error.message);
      }
      
      // Fetch bunk locations
      await fetchBunkLocations();
    };

    initializeApp();
  }, [getCurrentLocation]);

  // Re-fetch and update distances when user location changes
  useEffect(() => {
    if (userLocation && bunkLocations.length > 0) {
      const bunksWithDistance = addDistanceToBunks(bunkLocations, userLocation.lat, userLocation.lng);
      setBunkLocations(bunksWithDistance);
    }
  }, [userLocation]);

  // Handle location permission request
  const requestLocationPermission = async () => {
    try {
      setLocationPermission('requesting');
      await getCurrentLocation();
    } catch (error) {
      console.error('Location permission denied:', error);
    }
  };

  // Filter bunks for display
  const getDisplayBunks = () => {
    if (!bunkLocations.length) return [];
    
    // Sort by distance if user location is available, otherwise alphabetically
    return [...bunkLocations].sort((a, b) => {
      if (userLocation && a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return a.name.localeCompare(b.name);
    });
  };

  const displayBunks = getDisplayBunks();

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading charging stations...</span>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-4">
              <Zap className="h-12 w-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Error Loading Stations</h3>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchBunkLocations}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">EV Charging Stations</h1>
              <p className="text-gray-600">
                Found {displayBunks.length} charging station{displayBunks.length !== 1 ? 's' : ''}
                {userLocation ? ' near you' : ''}
              </p>
            </div>
            
            {/* Location Permission Status */}
            {locationPermission === 'denied' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Location Access Disabled</p>
                    <p className="text-xs text-yellow-700">Enable location for distance calculation and directions</p>
                    <button
                      onClick={requestLocationPermission}
                      className="text-xs text-yellow-800 underline hover:text-yellow-900 mt-1"
                    >
                      Enable Location
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4 mr-2" />
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'map' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Map className="h-4 w-4 mr-2" />
              Map View
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-4">
            {displayBunks.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Charging Stations Found</h3>
                <p className="text-gray-600">We couldn't find any charging stations at the moment.</p>
                <button
                  onClick={fetchBunkLocations}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
            ) : (
              displayBunks.map((bunk) => (
                <div key={bunk._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{bunk.name}</h3>
                      <p className="text-gray-600 flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {bunk.address}
                      </p>
                      {userLocation && bunk.distance && (
                        <p className="text-sm text-blue-600 font-medium">
                          📍 {bunk.distance.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        bunk.slotsAvailable > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <Zap className="h-4 w-4 mr-1" />
                        {bunk.slotsAvailable} Available
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">{bunk.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{bunk.operatingHours}</span>
                    </div>
                  </div>

                  {bunk.connectorTypes && bunk.connectorTypes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Available Connectors:</p>
                      <div className="flex flex-wrap gap-2">
                        {bunk.connectorTypes.map((connector, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {connector}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={() => openInGoogleMaps(bunk)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Open in Maps
                    </button>
                    
                    {userLocation && mapsLoaded && (
                      <button
                        onClick={() => handleShowDirections(bunk)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Map className="h-4 w-4 mr-2" />
                        Show Route
                      </button>
                    )}
                    
                    <button
                      onClick={() => navigate(`/admin/edit-bunk/${bunk._id}`)}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  </div>
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
                  <p className="text-gray-600">Loading Maps...</p>
                </div>
              </div>
            ) : (
              <div 
                ref={mapRef} 
                className="h-96 w-full"
                style={{ height: '500px' }}
              />
            )}
            
            {/* Map Controls */}
            <div className="p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {displayBunks.length} station{displayBunks.length !== 1 ? 's' : ''} shown on map
                </div>
                <div className="flex space-x-2">
                  {userLocation && (
                    <button
                      onClick={() => {
                        if (map) {
                          map.setCenter(new window.google.maps.LatLng(userLocation.lat, userLocation.lng));
                          map.setZoom(14);
                        }
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      📍 My Location
                    </button>
                  )}
                  <button
                    onClick={() => clearDirections()}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors"
                  >
                    Clear Routes
                  </button>
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