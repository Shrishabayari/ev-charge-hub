import EvBunk from '../models/EvBunkSchema.js';
import mongoose from 'mongoose';

// Add a new EV Bunk
export const addEvBunk = async (req, res) => {
  try {
    const { name, address, phone, slotsAvailable, latitude, longitude, operatingHours, connectorTypes } = req.body;

    // Validate input
    if (!name || !address || !phone || slotsAvailable === undefined || !latitude || !longitude || !operatingHours || !connectorTypes) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required.',
        required: ['name', 'address', 'phone', 'slotsAvailable', 'latitude', 'longitude', 'operatingHours', 'connectorTypes']
      });
    }

    // Create new EV Bunk
    const newEvBunk = new EvBunk({
      name,
      address,
      phone,
      slotsAvailable,
      latitude,
      longitude,
      operatingHours,
      connectorTypes,
    });

    // Save to database
    const savedEvBunk = await newEvBunk.save();

    res.status(201).json({
      success: true,
      message: 'EV Bunk added successfully!',
      data: savedEvBunk,
    });
  } catch (error) {
    console.error('Error adding EV Bunk:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// View all available EV Bunks
export const getAllEvBunks = async (req, res) => {
  try {
    // Fetch all EV Bunks
    const evBunks = await EvBunk.find();

    res.status(200).json({
      success: true,
      count: evBunks.length,
      data: evBunks
    });
  } catch (error) {
    console.error('Error fetching EV Bunks:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// View a specific EV Bunk by ID
export const getEvBunkById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Received ID:', id); // Debug log

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid EV Bunk ID format. Must be a valid MongoDB ObjectId.' 
      });
    }

    // Fetch the EV Bunk by ID
    const evBunk = await EvBunk.findById(id);

    if (!evBunk) {
      return res.status(404).json({ 
        success: false,
        message: 'EV Bunk not found.' 
      });
    }

    res.status(200).json({
      success: true,
      data: evBunk
    });
  } catch (error) {
    console.error('Error fetching EV Bunk by ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update an existing EV Bunk
export const updateEvBunk = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, slotsAvailable, latitude, longitude, operatingHours, connectorTypes } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid EV Bunk ID format.' 
      });
    }

    // Find the EV Bunk by ID and update
    const updatedEvBunk = await EvBunk.findByIdAndUpdate(
      id,
      { name, address, phone, slotsAvailable, latitude, longitude, operatingHours, connectorTypes },
      { new: true, runValidators: true }
    );

    if (!updatedEvBunk) {
      return res.status(404).json({ 
        success: false,
        message: 'EV Bunk not found.' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'EV Bunk updated successfully!',
      data: updatedEvBunk,
    });
  } catch (error) {
    console.error('Error updating EV Bunk:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete an EV Bunk
export const deleteEvBunk = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid EV Bunk ID format.' 
      });
    }

    // Find the EV Bunk by ID and delete
    const deletedEvBunk = await EvBunk.findByIdAndDelete(id);

    if (!deletedEvBunk) {
      return res.status(404).json({ 
        success: false,
        message: 'EV Bunk not found.' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'EV Bunk deleted successfully!',
      data: deletedEvBunk,
    });
  } catch (error) {
    console.error('Error deleting EV Bunk:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get EV bunks with available slots only
export const getAvailableEvBunks = async (req, res) => {
  try {
    const evBunks = await EvBunk.find({ slotsAvailable: { $gt: 0 } });
    res.status(200).json({
      success: true,
      count: evBunks.length,
      data: evBunks
    });
  } catch (error) {
    console.error('Error fetching available EV bunks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available EV bunk locations',
      error: error.message
    });
  }
};

// Get nearby EV bunks (within specified radius in kilometers)
export const getNearbyEvBunks = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query; // radius in km, default 10km
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const radiusInRadians = radius / 6371; // Earth's radius in km

    const evBunks = await EvBunk.find({
      latitude: {
        $gte: lat - radiusInRadians,
        $lte: lat + radiusInRadians
      },
      longitude: {
        $gte: lng - radiusInRadians,
        $lte: lng + radiusInRadians
      }
    });

    // Calculate actual distance and sort by distance
    const evBunksWithDistance = evBunks.map(bunk => {
      const distance = calculateDistance(lat, lng, bunk.latitude, bunk.longitude);
      return {
        ...bunk.toObject(),
        distance: parseFloat(distance.toFixed(2))
      };
    }).filter(bunk => bunk.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      count: evBunksWithDistance.length,
      data: evBunksWithDistance
    });
  } catch (error) {
    console.error('Error fetching nearby EV bunks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby EV bunk locations',
      error: error.message
    });
  }
};

// Search EV bunks by name or address
export const searchEvBunks = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const evBunks = await EvBunk.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } }
      ]
    });

    res.status(200).json({
      success: true,
      count: evBunks.length,
      data: evBunks
    });
  } catch (error) {
    console.error('Error searching EV bunks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search EV bunk locations',
      error: error.message
    });
  }
};

// Get EV bunks by connector type
export const getEvBunksByConnector = async (req, res) => {
  try {
    const { connectorType } = req.query;
    
    if (!connectorType) {
      return res.status(400).json({
        success: false,
        message: 'Connector type is required'
      });
    }

    const evBunks = await EvBunk.find({
      connectorTypes: { $in: [connectorType] }
    });

    res.status(200).json({
      success: true,
      count: evBunks.length,
      data: evBunks
    });
  } catch (error) {
    console.error('Error fetching EV bunks by connector:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch EV bunk locations by connector type',
      error: error.message
    });
  }
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}