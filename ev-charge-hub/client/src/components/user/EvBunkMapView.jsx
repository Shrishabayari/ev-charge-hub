import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, Clock, Map, List, Navigation } from 'lucide-react';
import UserNavbar from "../common/navbars/UserNavbar";
import Footer from "../common/Footer";
import  { apiMethods } from '../../api'; // Updated import

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

  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyDozw7FDv161gMDT9lE-U0cSGZuWjYhyvw';

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

  // Fetch EV bunk locations using proper API
  const fetchBunkLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching bunk locations...');
      
      // Use the imported API methods
      const response = await apiMethods.getAllBunks();
      
      console.log('📦 API response:', response.data);
      
      // Extract data from axios response
      const data = response.data;
      
      let bunks = [];
      if (data.success) {
        bunks = data.data || [];
        console.log('✅ Using data.data:', bunks.length, 'items');
      } else if (Array.isArray(data)) {
        bunks = data;
        console.log('✅ Using array data:', bunks.length, 'items');
      } else if (data.bunks) {
        bunks = data.bunks;
        console.log('✅ Using data.bunks:', bunks.length, 'items');
      } else {
        console.log('⚠️ Unexpected data format:', data);
        bunks = [];
      }

      // Validate and filter bunks
      const validBunks = bunks.filter(bunk => {
        const isValid = bunk && 
                       typeof bunk.latitude === 'number' && 
                       typeof bunk.longitude === 'number' &&
                       bunk.latitude !== 0 && 
                       bunk.longitude !== 0 &&
                       bunk.name;
        
        if (!isValid) {
          console.warn('⚠️ Invalid bunk data:', bunk);
        }
        return isValid;
      });

      console.log('✅ Valid bunks:', validBunks.length);

 // Add distance if user location is available
      let processedBunks = validBunks;
      if (userLocation) {
        processedBunks = addDistanceToBunks(validBunks, userLocation.lat, userLocation.lng);
        console.log('📍 Added distances to bunks');
      }

      setBunkLocations(processedBunks);
      console.log('✅ Bunk locations set successfully:', processedBunks.length);
      
    } catch (error) {
      console.error('❌ Error fetching bunk locations:', error);
      setError(`Failed to load EV charging stations: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch and location setup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Try to get user location first
        try {
          await getCurrentLocation();
          console.log('✅ User location obtained');
        } catch (locationError) {
          console.log('⚠️ Location access denied or unavailable:', locationError.message);
          // Continue without location
        }
        
        // Fetch bunk locations
        await fetchBunkLocations();
      } catch (error) {
        console.error('❌ App initialization error:', error);
        setError('Failed to initialize the application. Please refresh the page.');
      }
    };

    initializeApp();
  }, [getCurrentLocation]);

  // Refresh bunks when user location changes
  useEffect(() => {
    if (userLocation && bunkLocations.length > 0) {
      const bunksWithDistance = addDistanceToBunks(bunkLocations, userLocation.lat, userLocation.lng);
      setBunkLocations(bunksWithDistance);
    }
  }, [userLocation]);

 const handleBookSlot = (bunk) => {
    if (bunk.slotsAvailable === 0) {
      alert("No slots available at this station.");
      return;
    }
    // Navigate to the booking page, passing the selected bunk data
    navigate(`/user/book-slot`, { state: { bunk } });
  };

  // --- Loading State Display ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading charging stations...</p>
          </div>
        </div>
      </div>
    );
  }
  const refreshLocation = async () => {
    try {
      setLocationPermission('requesting');
      await getCurrentLocation();
      console.log('✅ Location refreshed');
    } catch (error) {
      console.error('❌ Failed to refresh location:', error);
      alert('Failed to get your location. Please check your browser settings and try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading EV charging stations...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Stations</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

   return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            EV Charging Stations
          </h1>
          <p className="text-gray-600">
            Find and navigate to nearby electric vehicle charging stations
          </p>
        </div>

        {/* Location Status Alert */}
        {locationPermission === 'denied' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Location Access Disabled
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Enable location access to see distances and get directions to charging stations.
                </p>
                
              </div>
            </div>
          </div>
        )}

        {/* Location Status / View Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {locationPermission === 'granted' ? (
              <span className="text-green-600 flex items-center gap-1 text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Location enabled {userLocation && ''}
              </span>
            ) : locationPermission === 'denied' ? (
              <span className="text-orange-600 flex items-center gap-1 text-sm font-medium">
                 Location denied
              </span>
            ) : locationPermission === 'requesting' ? (
              <span className="text-blue-600 flex items-center gap-1 text-sm font-medium">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Getting location...
              </span>
            ) : (
              <button
                onClick={refreshLocation}
                className="text-gray-600 hover:text-gray-700 flex items-center gap-1 underline text-sm font-medium"
              >
                <MapPin size={14} />
                Get location
              </button>
            )}
          </div>

          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List size={16} className="mr-2" />
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Map size={16} className="mr-2" />
              Map View
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          // List View
          <div className="space-y-4">
            {bunkLocations.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
                <Zap size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No charging stations found</h3>
                <p className="text-gray-600">We couldn't find any EV charging stations in your area.</p>
              </div>
            ) : (
              bunkLocations.map((bunk) => (
                <div
                  key={bunk._id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {bunk.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            bunk.slotsAvailable > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <Zap size={12} className="mr-1" />
                          {bunk.slotsAvailable > 0
                            ? `${bunk.slotsAvailable} slots available`
                            : 'No slots available'}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-2 text-gray-400" />
                          {bunk.address}
                        </div>

                        <div className="flex items-center">
                          <Clock size={14} className="mr-2 text-gray-400" />
                          {bunk.operatingHours}
                        </div>
                        {bunk.distance && (
                          <div className="flex items-center text-blue-600 font-medium">
                            <Navigation size={14} className="mr-2 text-blue-400" />
                            {bunk.distance.toFixed(1)} km away
                            {bunk.drivingTime && ` • ${bunk.drivingTime}`}
                          </div>
                        )}
                        {bunk.phone && (
                            <div className="flex items-center">
                                📞 {bunk.phone}
                            </div>
                        )}
                      </div>

                      {bunk.connectorTypes && bunk.connectorTypes.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">Available Connectors:</p>
                          <div className="flex flex-wrap gap-1">
                            {bunk.connectorTypes.map((connector, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
                              >
                                {connector}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                      {userLocation && mapsLoaded && (
                        <button
                          onClick={() => handleShowDirections(bunk)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          <Navigation size={16} />
                          Directions
                        </button>
                      )}
                      <button
                        onClick={() => openInGoogleMaps(bunk)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                      >
                        <Map size={16} />
                        Google Maps
                      </button>
                      <button
                        onClick={() => handleBookSlot(bunk)}
                        disabled={bunk.slotsAvailable === 0}
                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          bunk.slotsAvailable > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Zap size={16} />
                        {bunk.slotsAvailable > 0 ? 'Book Slot' : 'No Slots'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Map View
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {!mapsLoaded ? (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            ) : (
              <div ref={mapRef} className="w-full h-[70vh]" style={{ minHeight: '500px' }}></div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EvBunkMapView;