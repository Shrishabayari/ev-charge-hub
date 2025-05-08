import EvBunk from '../models/EvBunkSchema.js';

// Add a new EV Bunk
export const addEvBunk = async (req, res) => {
  try {
    const { bunkId, name, address, phone, slotsAvailable, latitude, longitude, operatingHours, connectorTypes } = req.body;

    // Validate input
    if (!name || !address || !phone || !slotsAvailable || !latitude || !longitude || !operatingHours || !connectorTypes) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create new EV Bunk
    const newEvBunk = new EvBunk({
      bunkId,
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
      message: 'EV Bunk added successfully!',
      evBunk: savedEvBunk,
    });
  } catch (error) {
    console.error('Error adding EV Bunk:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// View all available EV Bunks
export const getAllEvBunks = async (req, res) => {
  try {
    // Fetch all EV Bunks
    const evBunks = await EvBunk.find();

    if (evBunks.length === 0) {
      return res.status(404).json({ message: 'No EV Bunks found.' });
    }

    res.status(200).json(evBunks);
  } catch (error) {
    console.error('Error fetching EV Bunks:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// View a specific EV Bunk by ID
export const getEvBunkById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the EV Bunk by ID
    const evBunk = await EvBunk.findById(id);

    if (!evBunk) {
      return res.status(404).json({ message: 'EV Bunk not found.' });
    }

    res.status(200).json(evBunk);
  } catch (error) {
    console.error('Error fetching EV Bunk by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an existing EV Bunk
export const updateEvBunk = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, slotsAvailable, latitude, longitude, operatingHours, connectorTypes } = req.body;

    // Find the EV Bunk by ID and update
    const updatedEvBunk = await EvBunk.findByIdAndUpdate(
      id,
      { name, address, phone, slotsAvailable, latitude, longitude, operatingHours, connectorTypes },
      { new: true }
    );

    if (!updatedEvBunk) {
      return res.status(404).json({ message: 'EV Bunk not found.' });
    }

    res.status(200).json({
      message: 'EV Bunk updated successfully!',
      evBunk: updatedEvBunk,
    });
  } catch (error) {
    console.error('Error updating EV Bunk:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an EV Bunk
export const deleteEvBunk = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the EV Bunk by ID and delete
    const deletedEvBunk = await EvBunk.findByIdAndDelete(id);

    if (!deletedEvBunk) {
      return res.status(404).json({ message: 'EV Bunk not found.' });
    }

    res.status(200).json({
      message: 'EV Bunk deleted successfully!',
      evBunk: deletedEvBunk,
    });
  } catch (error) {
    console.error('Error deleting EV Bunk:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
