const Bunk = require('../models/bunkModel');

// @desc    Add new EV Bunk
// @route   POST /api/admin/ev-bunks/add
// @access  Public (or protect if you want later)
const addEvBunk = async (req, res) => {
  try {
    const {
      name,
      address,
      phone,
      slotsAvailable,
      latitude,
      longitude,
      operatingHours,
      connectorTypes,
    } = req.body;

    const newBunk = new Bunk({
      name,
      address,
      phone,
      slotsAvailable,
      latitude,
      longitude,
      operatingHours,
      connectorTypes: Array.isArray(connectorTypes) ? connectorTypes : JSON.parse(`[${connectorTypes}]`),
    });

    await newBunk.save();

    res.status(201).json({ message: 'EV Bunk added successfully!' });
  } catch (error) {
    console.error('Error adding EV Bunk:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addEvBunk };
