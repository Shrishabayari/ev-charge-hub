import React, { useState, useEffect, useCallback } from 'react';

const EvBunkAdminMap = () => {
  const [bunks, setBunks] = useState([]);
  const [selectedBunk, setSelectedBunk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Sample data - replace with your API call
  const sampleBunks = [
    {
      _id: '1',
      name: 'Downtown EV Station',
      address: '123 Main St, Downtown',
      phone: '+1-555-0123',
      slotsAvailable: 8,
      latitude: 40.7589,
      longitude: -73.9851,
      operatingHours: '06:00-22:00',
      connectorTypes: ['Type 2', 'CCS', 'CHAdeMO']
    },
    {
      _id: '2',
      name: 'Mall Charging Hub',
      address: '456 Shopping Blvd, Mall Area',
      phone: '+1-555-0456',
      slotsAvailable: 12,
      latitude: 40.7505,
      longitude: -73.9934,
      operatingHours: '24/7',
      connectorTypes: ['Type 2', 'CCS']
    },
    {
      _id: '3',
      name: 'Airport EV Center',
      address: '789 Airport Rd, Terminal 1',
      phone: '+1-555-0789',
      slotsAvailable: 15,
      latitude: 40.7614,
      longitude: -73.9776,
      operatingHours: '05:00-23:00',
      connectorTypes: ['Type 2', 'CCS', 'CHAdeMO', 'Tesla']
    }
  ];

  useEffect(() => {
    // Simulate API call - replace with actual API endpoint
    const fetchBunks = async () => {
      try {
        setLoading(true);
        // Replace this with your actual API call
        // const response = await fetch('/api/ev-bunks');
        // const data = await response.json();
        
        // Using sample data for demonstration
        setTimeout(() => {
          setBunks(sampleBunks);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching bunks:', error);
        setLoading(false);
      }
    };

    fetchBunks();
  }, []);

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = () => {
      if (window.google) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDozw7FDv161gMDT9lE-U0cSGZuWjYhyvw&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        setMapLoaded(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  const initializeMap = useCallback(() => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: { lat: 40.7589, lng: -73.9851 },
      mapTypeId: 'roadmap',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    const bounds = new window.google.maps.LatLngBounds();

    bunks.forEach((bunk) => {
      const position = { lat: bunk.latitude, lng: bunk.longitude };
      
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: bunk.name,
        icon: {
          url: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#10B981" stroke="#059669" stroke-width="2"/>
              <path d="M12 10h8v4h-2v8h-4v-8h-2z" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });

      marker.addListener('click', () => {
        setSelectedBunk(bunk);
        map.panTo(position);
        map.setZoom(15);
      });

      bounds.extend(position);
    });

    if (bunks.length > 1) {
      map.fitBounds(bounds);
    }
  }, [bunks]);

  useEffect(() => {
    if (mapLoaded && bunks.length > 0) {
      initializeMap();
    }
  }, [mapLoaded, bunks, initializeMap]);

  const formatOperatingHours = (hours) => {
    if (hours === '24/7') return '24/7';
    const [start, end] = hours.split('-');
    return `${start} - ${end}`;
  };

  const getStatusColor = (slotsAvailable) => {
    if (slotsAvailable === 0) return 'text-red-600 bg-red-50';
    if (slotsAvailable <= 3) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EV Bunks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">EV Bunk Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage and monitor all EV charging stations</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg overflow-y-auto">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-900">All Locations ({bunks.length})</h2>
          </div>
          
          <div className="divide-y">
            {bunks.map((bunk) => (
              <div
                key={bunk._id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedBunk?._id === bunk._id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                }`}
                onClick={() => setSelectedBunk(bunk)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">{bunk.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bunk.slotsAvailable)}`}>
                    {bunk.slotsAvailable} slots
                  </span>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-start">
                  <span className="inline-block w-4 h-4 text-gray-500 text-center text-xs mt-0.5 mr-2 flex-shrink-0">📍</span>
                  <span className="text-sm text-gray-700">{bunk.address}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 text-gray-500 text-center text-xs mr-2">🕒</span>
                  <span className="text-sm text-gray-700">{formatOperatingHours(bunk.operatingHours)}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 text-gray-500 text-center text-xs mr-2">⚡</span>
                  <span>{bunk.connectorTypes.join(', ')}</span>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div id="map" className="w-full h-full"></div>
          
          {!mapLoaded && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-pulse bg-gray-300 h-8 w-48 rounded mb-2 mx-auto"></div>
                <p className="text-gray-500">Loading Google Maps...</p>
                <p className="text-sm text-red-500 mt-2">Note: Add your Google Maps API key</p>
              </div>
            </div>
          )}

          {/* Selected Bunk Info Panel */}
          {selectedBunk && (
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">{selectedBunk.name}</h3>
                <button
                  onClick={() => setSelectedBunk(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="inline-block w-4 h-4 text-gray-500 text-center text-xs mt-0.5 mr-2 flex-shrink-0">📍</span>
                  <span className="text-sm text-gray-700">{selectedBunk.address}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 text-gray-500 text-center text-xs mr-2">📞</span>
                  <span className="text-sm text-gray-700">{selectedBunk.phone}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 text-gray-500 text-center text-xs mr-2">🕒</span>
                  <span className="text-sm text-gray-700">{formatOperatingHours(selectedBunk.operatingHours)}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="inline-block w-4 h-4 text-gray-500 text-center text-xs mr-2">👥</span>
                  <span className={`text-sm font-medium ${
                    selectedBunk.slotsAvailable === 0 ? 'text-red-600' :
                    selectedBunk.slotsAvailable <= 3 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {selectedBunk.slotsAvailable} slots available
                  </span>
                </div>
                
                <div className="flex items-start">
                  <span className="inline-block w-4 h-4 text-gray-500 text-center text-xs mt-0.5 mr-2 flex-shrink-0">⚡</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedBunk.connectorTypes.map((type, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm font-medium">
                  Edit Location
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvBunkAdminMap;