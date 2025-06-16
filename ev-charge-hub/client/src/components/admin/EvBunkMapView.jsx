import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Edit, MapPin, Zap, Clock, Map, List, Navigation } from 'lucide-react';
import AdminNavbar from "../common/navbars/AdminNavbar";
import Footer from "../common/Footer";
import { apiMethods } from '../../api'; // Updated import
import { useNavigate } from 'react-router-dom';

const EvBunkMapViews = () => {
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

  // Use environment variable or fallback API key
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyDozw7FDv161gMDT9lE-U0cSGZuWjYhyvw';

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    
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
  }, []);

  // Add distance calculation to bunks
  const addDistanceToBunks = useCallback((bunks, userLat, userLng) => {
    if (!userLat || !userLng || !Array.isArray(bunks)) return bunks;
    
    return bunks.map(bunk => ({
      ...bunk,
      distance: calculateDistance(userLat, userLng, bunk.latitude, bunk.longitude)
    })).sort((a, b) => a.distance - b.distance);
  }, [calculateDistance]);

  // Open Google Maps with directions
  const openInGoogleMaps = useCallback((bunk) => {
    if (!bunk || !bunk.latitude || !bunk.longitude) {
      console.error('Invalid bunk data for Google Maps');
      return;
    }
    
    let url;
    
    if (userLocation) {
      // If user location is available, show directions from current location
      url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${bunk.latitude},${bunk.longitude}/@${bunk.latitude},${bunk.longitude},15z/data=!4m2!4m1!3e0`;
    } else {
      // If no user location, just open the destination
      url = `https://www.google.com/maps/search/?api=1&query=${bunk.latitude},${bunk.longitude}&query_place_id=${encodeURIComponent(bunk.name || 'EV Station')}`;
    }
    
    // Open in new tab
    window.open(url, '_blank');
  }, [userLocation]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      setLocationPermission('requesting');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLocationPermission('granted');
          console.log('✅ User location obtained:', location);
          resolve(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationPermission('denied');
          
          let errorMessage = 'Unable to get your location.';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'Unknown location error occurred.';
              break;
          }
          
          reject(new Error(errorMessage));
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
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          setMapsLoaded(true);
          resolve();
          return;
        }

        // Check if script is already loading
        if (googleMapsScriptRef.current) {
          googleMapsScriptRef.current.addEventListener('load', () => {
            setMapsLoaded(true);
            resolve();
          });
          googleMapsScriptRef.current.addEventListener('error', reject);
          return;
        }

        // Check for existing script
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
        script.onerror = () => {
          reject(new Error('Failed to load Google Maps script'));
        };
        
        googleMapsScriptRef.current = script;
        document.head.appendChild(script);
      });
    };

    loadGoogleMaps().catch(error => {
      console.error('Failed to load Google Maps:', error);
      setError('Failed to load Google Maps. Please check your internet connection.');
    });

    return () => {
      if (googleMapsScriptRef.current && googleMapsScriptRef.current.parentNode) {
        googleMapsScriptRef.current.parentNode.removeChild(googleMapsScriptRef.current);
      }
      googleMapsScriptRef.current = null;
    };
  }, [GOOGLE_MAPS_API_KEY]);

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    if (markersRef.current) {
      markersRef.current.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
    }
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
    if (!map || !userLocation || !window.google || !destinationBunk) {
      console.log('Cannot show directions: missing requirements', { 
        map: !!map, 
        userLocation: !!userLocation, 
        google: !!window.google,
        destinationBunk: !!destinationBunk
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
            default:
              errorMessage = `Error: ${status}`;
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

      const center = userLocation || { lat: 12.9716, lng: 77.5946 }; // Default to Bangalore
      
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

  // Fetch EV bunk locations using proper API
  const fetchBunkLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching bunk locations...');
      
      // Use the imported API methods - Add error handling for API call
      let response;
      try {
        response = await apiMethods.getAllBunks();
      } catch (apiError) {
        console.error('API call failed:', apiError);
        throw new Error(`Failed to fetch data from server: ${apiError.message}`);
      }
      
      console.log('📦 API response:', response);
      
      // Extract data from axios response - More robust data extraction
      let data;
      if (response && response.data) {
        data = response.data;
      } else if (response) {
        data = response;
      } else {
        throw new Error('No data received from API');
      }
      
      console.log('📦 Extracted data:', data);
      
      let bunks = [];
      if (data.success && data.data) {
        bunks = Array.isArray(data.data) ? data.data : [];
        console.log('✅ Using data.data:', bunks.length, 'items');
      } else if (Array.isArray(data)) {
        bunks = data;
        console.log('✅ Using array data:', bunks.length, 'items');
      } else if (data.bunks && Array.isArray(data.bunks)) {
        bunks = data.bunks;
        console.log('✅ Using data.bunks:', bunks.length, 'items');
      } else {
        console.log('⚠️ Unexpected data format:', data);
        // Fallback: try to find any array in the data
        const possibleArrays = Object.values(data).filter(Array.isArray);
        if (possibleArrays.length > 0) {
          bunks = possibleArrays[0];
          console.log('✅ Using fallback array:', bunks.length, 'items');
        } else {
          bunks = [];
        }
      }

      // Validate and filter bunks with better validation
      const validBunks = bunks.filter(bunk => {
        const isValid = bunk && 
                       typeof bunk.latitude === 'number' && 
                       typeof bunk.longitude === 'number' &&
                       !isNaN(bunk.latitude) &&
                       !isNaN(bunk.longitude) &&
                       bunk.latitude !== 0 && 
                       bunk.longitude !== 0 &&
                       bunk.latitude >= -90 && bunk.latitude <= 90 &&
                       bunk.longitude >= -180 && bunk.longitude <= 180 &&
                       bunk.name && 
                       bunk.name.trim() !== '';
        
        if (!isValid) {
          console.warn('⚠️ Invalid bunk data:', bunk);
        }
        return isValid;
      });

      console.log('✅ Valid bunks:', validBunks.length);

      // Ensure required fields have defaults  
      const processedBunks = validBunks.map(bunk => ({
        ...bunk,
        slotsAvailable: typeof bunk.slotsAvailable === 'number' ? bunk.slotsAvailable : 0,
        address: bunk.address || 'Address not available',
        phone: bunk.phone || 'Phone not available',
        operatingHours: bunk.operatingHours || '24/7',
        connectorTypes: Array.isArray(bunk.connectorTypes) ? bunk.connectorTypes : []
      }));

      // Add distance if user location is available
      let finalBunks = processedBunks;
      if (userLocation) {
        finalBunks = addDistanceToBunks(processedBunks, userLocation.lat, userLocation.lng);
        console.log('📍 Added distances to bunks');
      }

      setBunkLocations(finalBunks);
      console.log('✅ Bunk locations set successfully:', finalBunks.length);
      
    } catch (error) {
      console.error('❌ Error fetching bunk locations:', error);
      setError(`Failed to load EV charging stations: ${error.message}`);
      
      // Set some demo data for testing if API fails
      if (process.env.NODE_ENV === 'development') {
        console.log('Setting demo data for development...');
        const demoBunks = [
          {
            _id: 'demo1',
            name: 'Demo Station 1',
            latitude: 12.9716,
            longitude: 77.5946,
            address: 'Demo Address 1, Bangalore',
            phone: '9876543210',
            operatingHours: '24/7',
            slotsAvailable: 3,
            connectorTypes: ['Type 2', 'CCS']
          },
          {
            _id: 'demo2',
            name: 'Demo Station 2',
            latitude: 12.9816,
            longitude: 77.6046,
            address: 'Demo Address 2, Bangalore',
            phone: '9876543211',
            operatingHours: '06:00 - 22:00',
            slotsAvailable: 0,
            connectorTypes: ['CHAdeMO']
          }
        ];
        setBunkLocations(demoBunks);
      }
    } finally {
      setLoading(false);
    }
  }, [userLocation, addDistanceToBunks]);

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
              ${bunk.connectorTypes && bunk.connectorTypes.length > 0 ? `
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
        url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
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

  // Get user location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        console.log('🔍 Getting user location...');
        await getCurrentLocation();
      } catch (error) {
        console.log('📍 Location access denied or failed:', error.message);
        // Continue without user location
      }
    };

    initializeLocation();
  }, [getCurrentLocation]);

  // Fetch data when component mounts or when user location changes
  useEffect(() => {
    fetchBunkLocations();
  }, [fetchBunkLocations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearMarkers();
      clearDirections();
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    };
  }, [clearMarkers, clearDirections]);
const handleEditBunk = useCallback((bunkId) => {
    console.log('Navigating to edit bunk:', bunkId);
    navigate(`/admin/edit-bunk/${bunkId}`); // Ensure this route is defined in your router
  }, [navigate]);
  const LocationPermissionBanner = () => {
    if (locationPermission === 'denied') {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <MapPin className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Location access denied.</strong> Enable location services to see distances and get directions to charging stations.
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                You can still view stations and get directions by clicking "Open in Google Maps".
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading EV charging stations...</p>
            {locationPermission === 'requesting' && (
              <p className="mt-2 text-sm text-blue-600">Requesting location access...</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-red-500 mb-4">
              <Zap className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Stations</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchBunkLocations();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNavbar />
      
      <div className="flex-1 container mx-auto px-4 py-6">
        <LocationPermissionBanner />
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            EV Charging Stations
          </h1>
          <p className="text-gray-600">
            Find and navigate to nearby electric vehicle charging stations
            {userLocation && ` (${bunkLocations.length} stations found)`}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => {
                setViewMode('list');
                clearDirections();
                setSelectedBunk(null);
              }}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4 mr-2" />
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Map className="h-4 w-4 mr-2" />
              Map View
            </button>
          </div>

          {userLocation && (
            <div className="text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border">
              📍 Location enabled
            </div>
          )}
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {bunkLocations.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Charging Stations Found</h3>
                <p className="text-gray-600">There are no EV charging stations available at the moment.</p>
              </div>
            ) : (
              bunkLocations.map((bunk) => (
                <div key={bunk._id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{bunk.name}</h3>
                      <p className="text-gray-600 mb-2">{bunk.address}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {bunk.operatingHours}
                        </span>
                        <span>📞 {bunk.phone}</span>
                        {bunk.distance && (
                          <span className="flex items-center">
                            <Navigation className="h-4 w-4 mr-1" />
                            {bunk.distance.toFixed(1)} km away
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bunk.slotsAvailable > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <Zap className="h-3 w-3 mr-1" />
                        {bunk.slotsAvailable} available
                      </div>
                    </div>
                  </div>

                  {bunk.connectorTypes && bunk.connectorTypes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Available Connectors:</p>
                      <div className="flex flex-wrap gap-2">
                        {bunk.connectorTypes.map((type, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={() => openInGoogleMaps(bunk)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Open in Google Maps
                    </button>
                    {userLocation && mapsLoaded && (
                      <button
                        onClick={() => handleShowDirections(bunk)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Show Route
                      </button>
                    )}
                    <button
                          onClick={() => handleEditBunk(bunk._id)}
                          className="flex items-center justify-center px-8 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition-colors text-sm"
                        >
                        <Edit size={16} className="mr-2" />
                           Edit
                        </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-96 md:h-[600px] relative">
              {!mapsLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading map...</p>
                  </div>
                </div>
              ) : (
                <div ref={mapRef} className="w-full h-full" />
              )}
            </div>
            
            {selectedBunk && (
              <div className="border-t bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedBunk.name}</h4>
                    <p className="text-sm text-gray-600">{selectedBunk.address}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => clearDirections()}
                      className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition duration-200"
                    >
                      Clear Route
                    </button>
                    <button
                      onClick={() => openInGoogleMaps(selectedBunk)}
                      className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-200"
                    >
                      Open in Google Maps
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EvBunkMapViews;